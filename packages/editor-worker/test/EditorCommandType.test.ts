import { expect, jest, test } from '@jest/globals'
import * as TextDocument from '../src/parts/TextDocument/TextDocument.ts'

jest.unstable_mockModule('../src/parts/Editor/Editor.ts', () => ({
  scheduleDocumentAndCursorsSelections: (editor: any, changes: any) => ({ ...editor, lines: TextDocument.applyEdits(editor, changes) }),
}))

const { type } = await import('../src/parts/EditorCommand/EditorCommandType.ts')

test('multiline typed input preserves document rows and a trailing newline', async () => {
  const text = 'first\nsecond\n'
  const editor = { lines: ['old', 'content'], selections: new Uint32Array([0, 0, 1, 7]) }
  const result = await type(editor, text)
  expect(result.lines).toEqual(['first', 'second', ''])
  expect(editor.lines).toEqual(['old', 'content'])
})

test('single line typing inserts at the selected column', async () => {
  const editor = { lines: ['before after'], selections: new Uint32Array([0, 7, 0, 7]) }
  const result = await type(editor, 'typed ')
  expect(result.lines).toEqual(['before typed after'])
})
