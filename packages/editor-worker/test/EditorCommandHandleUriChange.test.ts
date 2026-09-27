import { expect, test } from '@jest/globals'
import { handleUriChange } from '../src/parts/EditorCommand/EditorCommandHandleUriChange.ts'

test('handleUriChange retargets the editor without changing content', async () => {
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
})
