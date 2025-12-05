import { expect, test } from '@jest/globals'
import * as EditorDeleteSelection from '../src/parts/EditorCommand/EditorCommandDeleteSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test.skip('editorDeleteSelection', () => {
  const editor = {
    columnWidth: 8,
    cursor: {
      columnIndex: 0,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2'],
    rowHeight: 10,
    selections: [
      {
        end: {
          columnIndex: 2,
          rowIndex: 1,
        },
        start: {
          columnIndex: 1,
          rowIndex: 0,
        },
      },
    ],
    tokenizer: TokenizePlainText,
    x: 20,
    y: 10,
  }
  EditorDeleteSelection.editorDeleteSelection(editor)
  expect(editor.lines).toEqual(['lne 2'])
  expect(editor.selections).toEqual([])
  expect(editor.cursor).toEqual({
    columnIndex: 1,
    rowIndex: 0,
  })
})

test('editorDeleteSelection - when there is no selection', () => {
  const editor = {
    cursor: {
      columnIndex: 0,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['line 1', 'line 2'],
    selections: [],
  }
  EditorDeleteSelection.editorDeleteSelection(editor)
  expect(editor.lines).toEqual(['line 1', 'line 2'])
  expect(editor.selections).toEqual([])
  expect(editor.cursor).toEqual({
    columnIndex: 0,
    rowIndex: 0,
  })
})
