import { expect, test } from '@jest/globals'
import * as EditorSelectWordRight from '../src/parts/EditorCommand/EditorCommandSelectWordRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorSelectWordRight', () => {
  const editor = {
    lineCache: [],
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWordRight.selectWordRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWordRight - with umlaut', () => {
  const editor = {
    lineCache: [],
    lines: ['füße'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWordRight.selectWordRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWordRight - with accent', () => {
  const editor = {
    lineCache: [],
    lines: ['tàste'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWordRight.selectWordRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})

test('editorSelectWordRight - remains at end of document', () => {
  let editor = {
    lineCache: [],
    lines: ['one two', 'three four', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  for (let i = 0; i < 10; i++) {
    editor = EditorSelectWordRight.selectWordRight(editor)
  }
  expect(editor.selections).toEqual(EditorSelection.fromRange(0, 0, 2, 0))
})

test('editorSelectWordRight - remains at end without trailing newline', () => {
  let editor = {
    lineCache: [],
    lines: ['foo'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  for (let i = 0; i < 10; i++) {
    editor = EditorSelectWordRight.selectWordRight(editor)
  }
  expect(editor.selections).toEqual(EditorSelection.fromRange(0, 0, 0, 3))
})

test('editorSelectWordRight - remains at end of empty document', () => {
  const editor = {
    lineCache: [],
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWordRight.selectWordRight(editor).selections).toEqual(EditorSelection.fromRange(0, 0, 0, 0))
})

test('editorSelectWordRight - supports multiple cursors at end', () => {
  let editor = {
    lineCache: [],
    lines: ['foo', 'bar'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(0, 0, 0, 0, 1, 0, 1, 0),
  }
  for (let i = 0; i < 10; i++) {
    editor = EditorSelectWordRight.selectWordRight(editor)
  }
  expect(editor.selections).toEqual(EditorSelection.fromRanges(0, 0, 1, 3, 1, 0, 1, 3))
})
