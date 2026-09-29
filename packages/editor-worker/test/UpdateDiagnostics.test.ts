import { afterEach, expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker, registerMockRpc, remove, RendererWorker, RpcId, TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import { editorDiagnosticEffect } from '../src/parts/EditorDiagnosticEffect/EditorDiagnosticEffect.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { updateDiagnostics, updateDiagnosticsAll } from '../src/parts/UpdateDiagnostics/UpdateDiagnostics.ts'

const registerExtensionManagementWorkerMockRpc = (commandMap: any): any => {
  const rpc = ExtensionManagementWorker.registerMockRpc(commandMap)
  const invocations = (rpc as any).invocations
  ;(rpc as any).invokeAndTransfer = (method: string, ...params: readonly unknown[]) => (rpc as any).invoke(method, ...params)
  Object.defineProperty(rpc, 'invocations', {
    get: () => invocations.map(([method, ...params]: readonly unknown[]) => [method, ...params.filter((param) => !(param instanceof MessagePort))]),
  })
  return rpc
}

afterEach(() => {
  for (const key of EditorStates.getKeys()) {
    EditorStates.dispose(Number(key))
  }
  remove(RpcId.ErrorWorker)
  remove(RpcId.RendererWorker)
})

test('updateDiagnosticsAll refreshes every open editor', async () => {
  using extensionManagementWorkerRpc = registerExtensionManagementWorkerMockRpc({
    'Extensions.streamDiagnosticProvider': async (document: any) => [
      {
        message: `diagnostic for ${document.uri}`,
        uri: document.uri,
      },
    ],
  })
  using rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => undefined,
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  const firstEditor = {
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'javascript',
    lines: ['const first = 1'],
    uri: 'file:///first.js',
  }
  const secondEditor = {
    diagnosticsEnabled: true,
    id: 2,
    languageId: 'typescript',
    lines: ['const second = 2'],
    uri: 'file:///second.ts',
  }
  EditorStates.set(1, firstEditor as any, firstEditor as any)
  EditorStates.set(2, secondEditor as any, secondEditor as any)

  await updateDiagnosticsAll()

  expect(extensionManagementWorkerRpc.invocations).toEqual([
    [
      'Extensions.streamDiagnosticProvider',
      {
        documentId: 1,
        languageId: 'javascript',
        text: 'const first = 1',
        uri: 'file:///first.js',
      },
    ],
    [
      'Extensions.streamDiagnosticProvider',
      {
        documentId: 2,
        languageId: 'typescript',
        text: 'const second = 2',
        uri: 'file:///second.ts',
      },
    ],
  ])
  expect(EditorStates.get(1)?.newState.diagnostics).toEqual([
    {
      message: 'diagnostic for file:///first.js',
      uri: 'file:///first.js',
    },
  ])
  expect(EditorStates.get(2)?.newState.diagnostics).toEqual([
    {
      message: 'diagnostic for file:///second.ts',
      uri: 'file:///second.ts',
    },
  ])
  expect(rendererWorkerRpc.invocations).toEqual([
    ['Editor.renderPending', 1],
    ['Layout.handleDiagnosticsChange', 'file:///first.js'],
    ['Editor.renderPending', 2],
    ['Layout.handleDiagnosticsChange', 'file:///second.ts'],
  ])
})

test('updateDiagnostics applies a completed provider before slower providers finish and preserves both results', async () => {
  const fastDiagnostic = {
    columnIndex: 0,
    endColumnIndex: 1,
    endRowIndex: 0,
    message: 'fast provider',
    rowIndex: 0,
    type: 'error',
    uri: '/test.ts',
  }
  const slowDiagnostic = {
    columnIndex: 1,
    endColumnIndex: 2,
    endRowIndex: 0,
    message: 'slow provider',
    rowIndex: 0,
    type: 'warning',
    uri: '/test.ts',
  }
  const firstRender = Promise.withResolvers<void>()
  let resolveSlowProvider: (() => void) | undefined
  using extensionManagementWorkerRpc = registerExtensionManagementWorkerMockRpc({
    'Extensions.streamDiagnosticProvider': async (_document: any, resultPort: MessagePort) => {
      resultPort.postMessage({ providerCount: 2, providerIds: ['fast-provider', 'slow-provider'], type: 'providers' })
      resultPort.postMessage({ diagnostics: [fastDiagnostic], providerId: 'fast-provider', providerIndex: 0, type: 'result' })
      return new Promise<void>((resolve) => {
        resolveSlowProvider = () => {
          resultPort.postMessage({ diagnostics: [slowDiagnostic], providerId: 'slow-provider', providerIndex: 1, type: 'result' })
          resultPort.postMessage({ type: 'done' })
          resolve()
        }
      })
    },
  })
  using rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => firstRender.resolve(),
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  using textMeasurementWorkerRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.measureTextWidth': async () => 8,
  })
  const editor = {
    charWidth: 8,
    decorations: [],
    diagnostics: [],
    diagnosticsEnabled: true,
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: 400,
    id: 1,
    isMonospaceFont: false,
    itemHeight: 20,
    languageId: 'typescript',
    letterSpacing: 0,
    lines: ['const value: string = 1'],
    minLineY: 0,
    rowHeight: 20,
    tabSize: 2,
    uri: '/test.ts',
    viewLineIndices: [],
    width: 800,
  }
  EditorStates.set(1, editor as any, editor as any)

  const pendingUpdate = updateDiagnostics(editor)
  await firstRender.promise

  expect(EditorStates.get(1)?.newState.diagnostics).toEqual([fastDiagnostic])
  expect(resolveSlowProvider).toBeDefined()

  resolveSlowProvider!()
  await pendingUpdate

  expect(EditorStates.get(1)?.newState.diagnostics).toEqual([fastDiagnostic, slowDiagnostic])
  expect(extensionManagementWorkerRpc.invocations).toHaveLength(1)
  expect(rendererWorkerRpc.invocations).toEqual([
    ['Editor.renderPending', 1],
    ['Layout.handleDiagnosticsChange', '/test.ts'],
    ['Editor.renderPending', 1],
    ['Layout.handleDiagnosticsChange', '/test.ts'],
  ])
  expect(textMeasurementWorkerRpc.invocations.length).toBeGreaterThan(0)
})

test('updateDiagnostics reports failures through the error worker', async () => {
  const error = new Error('diagnostics failed')
  const prettyError = {
    codeFrame: 'code frame',
    message: 'diagnostics failed',
    stack: error.stack,
  }
  using extensionManagementWorkerRpc = registerExtensionManagementWorkerMockRpc({
    'Extensions.streamDiagnosticProvider': async () => {
      throw error
    },
  })
  const errorWorkerRpc = registerMockRpc(RpcId.ErrorWorker, {
    'Errors.prepare': async () => prettyError,
    'Errors.print': async () => undefined,
  })
  const editor = {
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'typescript',
    lines: ['const value: string = 1'],
    uri: '/test.ts',
  }
  EditorStates.set(1, editor as any, editor as any)

  await expect(updateDiagnostics(editor)).resolves.toBe(editor)
  expect(extensionManagementWorkerRpc.invocations).toEqual([
    [
      'Extensions.streamDiagnosticProvider',
      {
        documentId: 1,
        languageId: 'typescript',
        text: 'const value: string = 1',
        uri: '/test.ts',
      },
    ],
  ])
  expect(errorWorkerRpc.invocations).toEqual([
    ['Errors.prepare', error],
    ['Errors.print', prettyError, 'Failed to update diagnostics: '],
  ])
})

test('updateDiagnostics skips disabled diagnostics', async () => {
  const editor = {
    diagnosticsEnabled: false,
    id: 1,
  }

  await expect(updateDiagnostics(editor)).resolves.toBe(editor)
})

test('updateDiagnostics skips editor content that failed to load', async () => {
  const editor = {
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'json',
    lines: [],
    loadError: 'file not found',
    uri: 'file:///missing.json',
  }

  await expect(updateDiagnostics(editor)).resolves.toBe(editor)
})

test('updateDiagnostics ignores results after the editor is closed', async () => {
  const diagnosticsRequested = Promise.withResolvers<void>()
  const diagnosticsResult = Promise.withResolvers<readonly any[]>()
  const invoke = async () => {
    diagnosticsRequested.resolve()
    return diagnosticsResult.promise
  }
  ExtensionManagementWorker.set(
    MockRpc.create({
      commandMap: {},
      invoke,
      invokeAndTransfer: invoke,
    }),
  )
  const editor = {
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'typescript',
    lines: ['const value = 1'],
    uri: '/test.ts',
  }
  EditorStates.set(1, editor as any, editor as any)

  const pendingUpdate = updateDiagnostics(editor)
  await diagnosticsRequested.promise
  EditorStates.dispose(1)
  diagnosticsResult.resolve([{ columnIndex: 0, endColumnIndex: 1, rowIndex: 0, type: 'error' }])

  await expect(pendingUpdate).resolves.toBe(editor)
  expect(EditorStates.get(1)).toBeUndefined()
})

test('updateDiagnostics ignores stale results after the editor text changes', async () => {
  const diagnosticsRequested = Promise.withResolvers<void>()
  const diagnosticsResult = Promise.withResolvers<readonly any[]>()
  const invoke = async () => {
    diagnosticsRequested.resolve()
    return diagnosticsResult.promise
  }
  ExtensionManagementWorker.set(
    MockRpc.create({
      commandMap: {},
      invoke,
      invokeAndTransfer: invoke,
    }),
  )
  const editor = {
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'typescript',
    lines: ['const value = 1'],
    uri: '/test.ts',
  }
  const edited = {
    ...editor,
    lines: ['const value = 2'],
  }
  EditorStates.set(1, editor as any, editor as any)

  const pendingUpdate = updateDiagnostics(editor)
  await diagnosticsRequested.promise
  EditorStates.set(1, editor as any, edited as any)
  diagnosticsResult.resolve([{ columnIndex: 0, endColumnIndex: 1, rowIndex: 0, type: 'error' }])

  await expect(pendingUpdate).resolves.toBe(editor)
  expect(EditorStates.get(1)?.newState).toBe(edited)
})

test.each(['stale response finishes first', 'fresh response finishes first'])(
  'updateDiagnostics refreshes edited text when the %s',
  async (completionOrder) => {
    const requested = [Promise.withResolvers<void>(), Promise.withResolvers<void>()]
    const results = [Promise.withResolvers<readonly any[]>(), Promise.withResolvers<readonly any[]>()]
    let requestIndex = 0
    using extensionManagementWorkerRpc = registerExtensionManagementWorkerMockRpc({
      'Extensions.streamDiagnosticProvider': async () => {
        const index = requestIndex++
        requested[index].resolve()
        return results[index].promise
      },
    })
    using rendererWorkerRpc = RendererWorker.registerMockRpc({
      'Editor.renderPending': async () => undefined,
      'Layout.handleDiagnosticsChange': async () => undefined,
    })
    const editor = {
      diagnostics: [],
      diagnosticsEnabled: true,
      id: 1,
      languageId: 'typescript',
      lines: ['const value = 1'],
      uri: '/test.ts',
    }
    const edited = { ...editor, lines: ['const value = 2'] }
    const staleDiagnostics = [{ message: 'stale diagnostic', uri: editor.uri }]
    const currentDiagnostics = [{ message: 'current diagnostic', uri: editor.uri }]
    EditorStates.set(1, editor as any, editor as any)

    const staleUpdate = updateDiagnostics(editor)
    await requested[0].promise
    EditorStates.set(1, editor as any, edited as any)
    const currentUpdate = editorDiagnosticEffect.apply(edited as any)
    await requested[1].promise

    expect(extensionManagementWorkerRpc.invocations).toEqual([
      [
        'Extensions.streamDiagnosticProvider',
        {
          documentId: 1,
          languageId: 'typescript',
          text: 'const value = 1',
          uri: '/test.ts',
        },
      ],
      [
        'Extensions.streamDiagnosticProvider',
        {
          documentId: 1,
          languageId: 'typescript',
          text: 'const value = 2',
          uri: '/test.ts',
        },
      ],
    ])

    let diagnosticsAfterStaleResponse
    if (completionOrder === 'stale response finishes first') {
      results[0].resolve(staleDiagnostics)
      await staleUpdate
      diagnosticsAfterStaleResponse = EditorStates.get(1)?.newState.diagnostics
      results[1].resolve(currentDiagnostics)
      await currentUpdate
    } else {
      results[1].resolve(currentDiagnostics)
      await currentUpdate
      results[0].resolve(staleDiagnostics)
      await staleUpdate
      diagnosticsAfterStaleResponse = EditorStates.get(1)?.newState.diagnostics
    }

    const expectedDiagnosticsAfterStaleResponse = completionOrder === 'stale response finishes first' ? edited.diagnostics : currentDiagnostics
    expect(diagnosticsAfterStaleResponse).toBe(expectedDiagnosticsAfterStaleResponse)
    expect(EditorStates.get(1)?.newState.diagnostics).toEqual(currentDiagnostics)
    expect(rendererWorkerRpc.invocations).toEqual([
      ['Editor.renderPending', 1],
      ['Layout.handleDiagnosticsChange', '/test.ts'],
    ])
  },
)

test('updateDiagnostics ignores results after loading the document fails', async () => {
  const diagnosticsRequested = Promise.withResolvers<void>()
  const diagnosticsResult = Promise.withResolvers<readonly any[]>()
  using _extensionManagementWorkerRpc = registerExtensionManagementWorkerMockRpc({
    'Extensions.streamDiagnosticProvider': async () => {
      diagnosticsRequested.resolve()
      return diagnosticsResult.promise
    },
  })
  const editor = {
    diagnostics: [],
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'json',
    lines: [],
    uri: 'file:///missing.json',
  }
  const failedLoad = { ...editor, loadError: 'file not found' }
  EditorStates.set(1, editor as any, editor as any)

  const pendingUpdate = updateDiagnostics(editor)
  await diagnosticsRequested.promise
  EditorStates.set(1, editor as any, failedLoad as any)
  diagnosticsResult.resolve([{ message: 'Expected a JSON value', uri: editor.uri }])

  await expect(pendingUpdate).resolves.toBe(editor)
  expect(EditorStates.get(1)?.newState).toBe(failedLoad)
})

test('updateDiagnostics preserves scrolling and skips rendering for unchanged empty diagnostics', async () => {
  const diagnosticsRequested = Promise.withResolvers<void>()
  const diagnosticsResult = Promise.withResolvers<readonly any[]>()
  using extensionManagementWorkerRpc = registerExtensionManagementWorkerMockRpc({
    'Extensions.streamDiagnosticProvider': async () => {
      diagnosticsRequested.resolve()
      return diagnosticsResult.promise
    },
  })
  using rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => undefined,
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  const editor = {
    deltaY: 0,
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'typescript',
    lines: ['const value = 1'],
    uri: 'file:///test.ts',
  }
  const scrolledEditor = {
    ...editor,
    deltaY: 100,
  }
  EditorStates.set(1, editor as any, editor as any)

  const pendingUpdate = updateDiagnostics(editor)
  await diagnosticsRequested.promise
  EditorStates.set(1, editor as any, scrolledEditor as any)
  diagnosticsResult.resolve([])
  await pendingUpdate

  expect(extensionManagementWorkerRpc.invocations).toHaveLength(1)
  expect(EditorStates.get(1)?.newState.deltaY).toBe(100)
  expect(rendererWorkerRpc.invocations).toEqual([])
})

test('updateDiagnostics preserves scrolling while diagnostic decorations are calculated', async () => {
  const measurementRequested = Promise.withResolvers<void>()
  const measurementResult = Promise.withResolvers<number>()
  using extensionManagementWorkerRpc = registerExtensionManagementWorkerMockRpc({
    'Extensions.streamDiagnosticProvider': async () => [
      {
        code: 1,
        columnIndex: 1,
        endColumnIndex: 2,
        endRowIndex: 0,
        message: 'problem',
        rowIndex: 0,
        source: 'test',
        type: 'error',
        uri: 'file:///test.ts',
      },
    ],
  })
  using textMeasurementWorkerRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.measureTextWidth': async () => {
      measurementRequested.resolve()
      return measurementResult.promise
    },
  })
  using rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => undefined,
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  const editor = {
    charWidth: 8,
    decorations: [],
    deltaY: 0,
    diagnostics: [],
    diagnosticsEnabled: true,
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: 400,
    id: 1,
    isMonospaceFont: false,
    itemHeight: 20,
    languageId: 'typescript',
    letterSpacing: 0,
    lines: ['const value = 1'],
    minLineY: 0,
    rowHeight: 20,
    tabSize: 2,
    uri: 'file:///test.ts',
    viewLineIndices: [],
    width: 800,
  }
  const scrolledEditor = {
    ...editor,
    deltaY: 100,
  }
  EditorStates.set(1, editor as any, editor as any)

  const pendingUpdate = updateDiagnostics(editor)
  await measurementRequested.promise
  EditorStates.set(1, editor as any, scrolledEditor as any)
  measurementResult.resolve(8)
  await pendingUpdate

  expect(extensionManagementWorkerRpc.invocations).toHaveLength(1)
  expect(textMeasurementWorkerRpc.invocations).toHaveLength(4)
  expect(EditorStates.get(1)?.newState.deltaY).toBe(100)
  expect(rendererWorkerRpc.invocations).toEqual([
    ['Editor.renderPending', 1],
    ['Layout.handleDiagnosticsChange', 'file:///test.ts'],
  ])
})

test('updateDiagnostics ignores a result for the previous language mode', async () => {
  const requested = Promise.withResolvers<void>()
  const result = Promise.withResolvers<readonly any[]>()
  using _extensionRpc = registerExtensionManagementWorkerMockRpc({
    'Extensions.streamDiagnosticProvider': async () => {
      requested.resolve()
      return result.promise
    },
  })
  using _rendererRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': async () => undefined,
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  const editor = {
    diagnostics: [],
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'javascript',
    lines: ['const value: string = "text"'],
    uri: 'file:///test.ts',
  }
  EditorStates.set(1, editor as any, editor as any)
  const pending = updateDiagnostics(editor)
  await requested.promise
  const changed = { ...editor, languageId: 'typescript' }
  EditorStates.set(1, editor as any, changed as any)
  result.resolve([{ message: 'Unexpected token :' }])
  await pending

  expect(EditorStates.get(1).newState).toBe(changed)
})
