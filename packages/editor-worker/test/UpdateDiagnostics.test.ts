import { afterEach, expect, test } from '@jest/globals'
import { ExtensionHost, registerMockRpc, remove, RpcId } from '@lvce-editor/rpc-registry'
import { getEditorWithDiagnostics } from '../src/parts/UpdateDiagnostics/UpdateDiagnostics.ts'

afterEach(() => {
  remove(RpcId.ErrorWorker)
})

test('getEditorWithDiagnostics reports failures through the error worker', async () => {
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
    id: 1,
    languageId: 'typescript',
    lines: ['const value: string = 1'],
    uri: '/test.ts',
  }

  await expect(getEditorWithDiagnostics(editor)).resolves.toBe(editor)
  expect(extensionHostRpc.invocations).toEqual([['ExtensionHostTextDocument.syncFull', '/test.ts', 1, 'typescript', 'const value: string = 1']])
  expect(errorWorkerRpc.invocations).toEqual([
    ['Errors.prepare', error],
    ['Errors.print', prettyError, 'Failed to update diagnostics: '],
  ])
})
