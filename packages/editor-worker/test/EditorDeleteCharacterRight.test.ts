import { expect, test } from '@jest/globals'
import * as EditorDeleteCharacterRight from '../src/parts/EditorCommand/EditorCommandDeleteCharacterRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('deleteCharacterRight', async () => {
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
    lineCache: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('deleteCharacterRight - with selection', async () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    undoStack: [],
    lineCache: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['lne 2'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('deleteCharacterRight - empty line', async () => {
  const editor = {
    lines: ['', 'next line'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
    lineCache: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['next line'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('deleteCharacterRight - merge lines', async () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 6, 0, 6),
    undoStack: [],
    lineCache: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['line 1line 2'],
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('deleteCharacterRight - emoji - 👮🏽‍♀️', async () => {
  const editor = {
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
    lineCache: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lines: [''],
  })
})

test('deleteCharacterRight - multiple words', async () => {
  const editor = {
    lines: ['sample text'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    undoStack: [],
    lineCache: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['sampl text'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})
