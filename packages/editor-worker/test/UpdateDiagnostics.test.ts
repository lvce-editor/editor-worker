import { afterEach, expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, ExtensionManagementWorker, registerMockRpc, remove, RpcId } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { updateDiagnostics } from '../src/parts/UpdateDiagnostics/UpdateDiagnostics.ts'

afterEach(() => {
  EditorStates.dispose(1)
  remove(RpcId.ErrorWorker)
})

test('updateDiagnostics reports failures through the error worker', async () => {
  const error = new Error('diagnostics failed')
  const prettyError = {
    codeFrame: 'code frame',
    message: 'diagnostics failed',
    stack: error.stack,
  }
  using extensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostTextDocument.syncFull': async () => {
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
  expect(extensionHostRpc.invocations).toEqual([['ExtensionHostTextDocument.syncFull', '/test.ts', 1, 'typescript', 'const value: string = 1']])
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
  using extensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostTextDocument.syncFull': async () => undefined,
  })
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
  expect(extensionHostRpc.invocations).toEqual([['ExtensionHostTextDocument.syncFull', '/test.ts', 1, 'typescript', 'const value = 1']])
})
