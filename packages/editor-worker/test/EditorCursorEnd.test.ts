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

test('editorCursorEnd - before CRLF line ending', () => {
  const editor = {
    lineCache: [],
    lines: ['first\r', 'second\r', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('editorCursorEnd - collapses cursors on the same line', () => {
  const editor = {
    lineCache: [],
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(0, 1, 0, 1, 0, 3, 0, 3),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('editorCursorEnd - keeps cursors on different lines', () => {
  const editor = {
    lineCache: [],
    lines: ['aaaaa', 'bbb'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(0, 1, 0, 1, 1, 1, 1, 1),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRanges(0, 5, 0, 5, 1, 3, 1, 3),
  })
})

test('editorCursorEnd - keeps an existing end cursor only once', () => {
  const editor = {
    lineCache: [],
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(0, 1, 0, 1, 0, 5, 0, 5),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('editorCursorEnd - repeated End keeps one cursor', () => {
  const editor = {
    lineCache: [],
    lines: ['aaaaa'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(0, 1, 0, 1, 0, 3, 0, 3),
  }
  const afterFirstEnd = EditorCursorEnd.cursorEnd(editor)
  expect(EditorCursorEnd.cursorEnd(afterFirstEnd)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('editorCursorEnd - collapses cursors on an empty line', () => {
  const editor = {
    lineCache: [],
    lines: ['', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(0, 0, 0, 0, 0, 0, 0, 0),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorEnd - remaps a duplicate primary selection', () => {
  const editor = {
    lineCache: [],
    lines: ['aaaaa', 'bbb'],
    primarySelectionIndex: 4,
    selections: EditorSelection.fromRanges(0, 1, 0, 1, 0, 3, 0, 3, 1, 0, 1, 0),
  }
  expect(EditorCursorEnd.cursorEnd(editor)).toMatchObject({
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(0, 5, 0, 5, 1, 3, 1, 3),
  })
})
