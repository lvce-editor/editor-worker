import { expect, test } from '@jest/globals'
import { ExtensionHost } from '@lvce-editor/rpc-registry'
import { handleUriChange } from '../src/parts/EditorCommand/EditorCommandHandleUriChange.ts'

test('handleUriChange retargets the editor and extension host document without changing content', async () => {
  using mockRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostTextDocument.syncFull'() {},
  })
  const editor = {
    id: 42,
    languageId: 'plaintext',
    lines: ['hello', 'world'],
    modified: true,
    uri: '/test/original.txt',
  }

  const result = await handleUriChange(editor as any, '/test/renamed.txt')

  expect(result).toEqual({
    ...editor,
    uri: '/test/renamed.txt',
  })
  expect(mockRpc.invocations).toEqual([['ExtensionHostTextDocument.syncFull', '/test/renamed.txt', 42, 'plaintext', 'hello\nworld']])
})
