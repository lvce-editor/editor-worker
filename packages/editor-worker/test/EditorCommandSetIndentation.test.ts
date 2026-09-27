import { expect, test } from '@jest/globals'
import { setIndentation } from '../src/parts/EditorCommand/EditorCommandSetIndentation.ts'

test('setIndentation changes the indentation mode', () => {
  const editor = { focused: false, insertSpaces: true }
  expect(setIndentation(editor, false)).toEqual({ focused: true, insertSpaces: false })
})

test('setIndentation preserves the editor when unchanged', () => {
  const editor = { insertSpaces: true }
  expect(setIndentation(editor, true)).toBe(editor)
})
