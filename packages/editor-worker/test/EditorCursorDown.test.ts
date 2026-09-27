import { expect, test } from '@jest/globals'
import * as EditorCursorDown from '../src/parts/EditorCommand/EditorCommandCursorDown.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorCursorDown', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCursorDown - with selection', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 1),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(2, 1, 2, 1),
  })
})

test.skip('editorCursorDown - with emoji - 👮🏽‍♀️', () => {
  const editor = {
    lineCache: [],
    lines: ['👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️', 'abc'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 21, 0, 21),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 3, 1, 3),
  })
})

test('editorCursorDown - line below is shorter', () => {
  const editor = {
    lineCache: [],
    lines: ['abcd', 'a'],
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorCursorDown.cursorDown(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  })
})

test.each([['line 1', 'line 2'], [''], ['line 1', '']])('editorCursorDown stays within document %j', (...lines) => {
  let editor: any = {
    lineCache: [],
    lines,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  for (let i = 0; i < 4; i++) {
    editor = EditorCursorDown.cursorDown(editor)
    expect(editor.selections).toEqual(EditorSelection.fromRange(Math.min(i + 1, lines.length - 1), 0, Math.min(i + 1, lines.length - 1), 0))
  }
})
