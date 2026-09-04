import { afterEach, expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker, registerMockRpc, remove, RendererWorker, RpcId, TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { updateDiagnostics, updateDiagnosticsAll } from '../src/parts/UpdateDiagnostics/UpdateDiagnostics.ts'

afterEach(() => {
  for (const key of EditorStates.getKeys()) {
    EditorStates.dispose(Number(key))
  }
  remove(RpcId.ErrorWorker)
  remove(RpcId.RendererWorker)
})

test('updateDiagnosticsAll refreshes every open editor', async () => {
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async (document: any) => [
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
      'Extensions.executeDiagnosticProvider',
      {
        documentId: 1,
        languageId: 'javascript',
        text: 'const first = 1',
        uri: 'file:///first.js',
      },
    ],
    [
      'Extensions.executeDiagnosticProvider',
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

test('updateDiagnostics reports failures through the error worker', async () => {
  const error = new Error('diagnostics failed')
  const prettyError = {
    codeFrame: 'code frame',
    message: 'diagnostics failed',
    stack: error.stack,
  }
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async () => {
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
      'Extensions.executeDiagnosticProvider',
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

test('updateDiagnostics ignores results after the editor is closed', async () => {
  const diagnosticsRequested = Promise.withResolvers<void>()
  const diagnosticsResult = Promise.withResolvers<readonly any[]>()
  ExtensionManagementWorker.set(
    MockRpc.create({
      commandMap: {},
      invoke: async () => {
        diagnosticsRequested.resolve()
        return diagnosticsResult.promise
      },
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
  ExtensionManagementWorker.set(
    MockRpc.create({
      commandMap: {},
      invoke: async () => {
        diagnosticsRequested.resolve()
        return diagnosticsResult.promise
      },
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

test('updateDiagnostics preserves scrolling and skips rendering for unchanged empty diagnostics', async () => {
  const diagnosticsRequested = Promise.withResolvers<void>()
  const diagnosticsResult = Promise.withResolvers<readonly any[]>()
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async () => {
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
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async () => [
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
  expect(textMeasurementWorkerRpc.invocations).toHaveLength(2)
  expect(EditorStates.get(1)?.newState.deltaY).toBe(100)
  expect(rendererWorkerRpc.invocations).toEqual([
    ['Editor.renderPending', 1],
    ['Layout.handleDiagnosticsChange', 'file:///test.ts'],
  ])
})
