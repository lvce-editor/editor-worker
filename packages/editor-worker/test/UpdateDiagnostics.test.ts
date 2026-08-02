import { afterEach, expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker, registerMockRpc, remove, RendererWorker, RpcId } from '@lvce-editor/rpc-registry'
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
    ['Layout.handleDiagnosticsChange', 'file:///first.js'],
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

test('updateDiagnostics notifies the renderer after storing diagnostics', async () => {
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': async () => [],
  })
  using rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Layout.handleDiagnosticsChange': async () => undefined,
  })
  const editor = {
    diagnosticsEnabled: true,
    id: 1,
    languageId: 'typescript',
    lines: ['const value = 1'],
    uri: 'file:///test.ts',
  }
  EditorStates.set(1, editor as any, editor as any)

  await updateDiagnostics(editor)

  expect(extensionManagementWorkerRpc.invocations).toHaveLength(1)
  expect(rendererWorkerRpc.invocations).toEqual([['Layout.handleDiagnosticsChange', 'file:///test.ts']])
})
