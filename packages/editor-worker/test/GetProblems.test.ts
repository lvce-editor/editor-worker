import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getProblems } from '../src/parts/GetProblems/GetProblems.ts'

test('getProblems preserves fractional editor ids', async () => {
  const editorId = 0.123456
  const editor = {
    id: editorId,
    languageId: 'javascript',
    lines: ['const value = 1'],
    uid: editorId,
    uri: '/test.js',
  }
  const diagnostics = [
    {
      message: 'test problem',
      uri: editor.uri,
    },
  ]
  EditorStates.set(editorId, editor as any, editor as any)
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': () => diagnostics,
  })

  await expect(getProblems()).resolves.toEqual(diagnostics)
  expect(mockRpc.invocations).toEqual([
    [
      'Extensions.executeDiagnosticProvider',
      {
        documentId: editorId,
        languageId: editor.languageId,
        text: editor.lines[0],
        uri: editor.uri,
      },
    ],
  ])
})
