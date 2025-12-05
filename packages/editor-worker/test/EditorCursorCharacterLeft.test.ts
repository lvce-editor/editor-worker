import { expect, test } from '@jest/globals'
import * as EditorCursorLeft from '../src/parts/EditorCommand/EditorCommandCursorCharacterLeft.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorCursorCharacterLeft - at start', () => {
  const editor = {
    lineCache: [],
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorLeft.cursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - one after start of line', () => {
  const editor = {
    lineCache: [],
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(EditorCursorLeft.cursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - with selection', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  }

  expect(EditorCursorLeft.cursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - at start of line', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  }
  expect(EditorCursorLeft.cursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('editorCursorCharacterLeft - emoji - 👮🏽‍♀️', () => {
  const columnIndex = '👮🏽‍♀️'.length
  const editor = {
    lineCache: [],
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, columnIndex, 0, columnIndex),
  }
  expect(EditorCursorLeft.cursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorCharacterLeft - unicode - zero width space', () => {
  const editor = {
    lineCache: [],
    lines: ['\u200B'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursorLeft.cursorCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
