import { expect, test } from '@jest/globals'
import * as EditorCopyLineUp from '../src/parts/EditorCommand/EditorCommandCopyLineUp.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorCopyLineUp', () => {
  const cursor = {
    rowIndex: 2,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
  }
  const newEditor = EditorCopyLineUp.copyLineUp(editor)
  expect(newEditor.lines).toEqual(['line 1', 'line 2', 'line 3', 'line 3'])
  expect(newEditor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 0,
  })
})
