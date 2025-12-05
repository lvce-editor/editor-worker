import { expect, test } from '@jest/globals'
import * as EditorSelectWord from '../src/parts/EditorCommand/EditorCommandSelectWord.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorSelectWord', () => {
  const editor = {
    lineCache: [],
    lines: ['abcde', 'abcde'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 5)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})

test('editorSelectWord - with numbers', () => {
  const editor = {
    lineCache: [],
    lines: ['11111', '22222'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 0)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})

test('editorSelectWord - with umlaut', () => {
  const editor = {
    lineCache: [],
    lines: ['füße'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 0)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWord - with accent', () => {
  const editor = {
    lineCache: [],
    lines: ['tàste'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 0)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})

test('editorSelectWord - with word before', () => {
  const cursor = {
    columnIndex: 3,
    rowIndex: 0,
  }
  const editor = {
    cursor,
    lineCache: [],
    lines: ['abc   '],
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 3)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 3),
  })
})

test('editorSelectWord - with word after', () => {
  const editor = {
    lineCache: [],
    lines: ['   def'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  }
  expect(EditorSelectWord.selectWord(editor, 0, 3)).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 6),
  })
})
