import { expect, test } from '@jest/globals'
import * as EditorDeleteAllLeft from '../src/parts/EditorCommand/EditorCommandDeleteAllLeft.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('editorDeleteAllLeft', async () => {
  const editor = createDefaultState({
    lines: ['1 2 3 4 5'],
    selections: EditorSelection.fromRange(0, 9, 0, 9),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteAllLeft in middle', async () => {
  const editor = createDefaultState({
    lines: ['1 2 3 4 5'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: [' 4 5'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorDeleteAllLeft - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  expect(EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    line: ['lne 2'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteAllLeft - at start of line', async () => {
  const editor = createDefaultState({
    lines: ['1', '2'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: ['12'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteAllLeft - at start of file', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = createDefaultState({
    lines: ['1', '2'],
    cursor,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: ['1', '2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
