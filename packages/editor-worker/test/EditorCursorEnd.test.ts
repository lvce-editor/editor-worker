import { expect, test } from '@jest/globals'
import * as EditorCursorEnd from '../src/parts/EditorCommand/EditorCommandCursorEnd.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorCursorEnd', () => {
  const editor = {
    lineCache: [],
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('editorCursorEnd - with selection', () => {
  const editor = {
    cursor: {
      columnIndex: 4,
      rowIndex: 0,
    },
    lineCache: [],
    lines: ['aaaaa'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})
