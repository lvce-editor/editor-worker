import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as EditorDeleteCharacterLeft from '../src/parts/EditorCommand/EditorCommandDeleteCharacterLeft.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorDeleteCharacterLeft', async () => {
  const editor = createDefaultState({
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterLeft - when line is empty', async () => {
  const editor = createDefaultState({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterLeft - merge lines', async () => {
  const editor = createDefaultState({
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: ['1111122222'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test('line below show not disappear', async () => {
  const editor = createDefaultState({
    lines: ['11111', '22222', '33333'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 3, 1, 3),
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: ['11111', '2222', '33333'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('line below show not disappear 2', async () => {
  const editor = createDefaultState({
    lines: ['11111', '22222', '33333'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 5, 1, 5),
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: ['11111', '2222', '33333'],
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  })
})

test('editorDeleteCharacterLeft - with selection', async () => {
  const editor = createDefaultState({
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 1, 1, 2),
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: ['lne 2'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

// TODO test merging multiple lines with multiple cursors/selections

test('editorDeleteCharacterLeft - emoji - 👮🏽‍♀️', async () => {
  const columnIndex = '👮🏽‍♀️'.length
  const editor = createDefaultState({
    lines: ['👮🏽‍♀️'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, columnIndex, 0, columnIndex),
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterLeft - delete auto closing bracket', async () => {
  const editor = createDefaultState({
    lines: ['{}'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    autoClosingRanges: [0, 1, 0, 1],
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterLeft - delete multiple auto closing bracket', async () => {
  const editor = createDefaultState({
    lines: ['{}', '{}'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 1, 0, 1, 1, 1, 1, 1]),
    autoClosingRanges: [0, 1, 0, 1, 1, 1, 1, 1],
  })
  const newState = await EditorDeleteCharacterLeft.deleteCharacterLeft(editor)
  expect(newState).toMatchObject({
    lines: ['', ''],
    selections: new Uint32Array([0, 0, 0, 0, 1, 0, 1, 0]),
  })
})
