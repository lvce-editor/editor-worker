import { expect, test } from '@jest/globals'
import * as EditorDeleteAllRight from '../src/parts/EditorCommand/EditorCommandDeleteAllRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('editorDeleteAllRight - at start', async () => {
  const editor = createDefaultState({
    lines: ['1 2 3 4 5'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorDeleteAllRight.deleteAllRight(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteAllRight in middle', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 5,
  }
  const editor = createDefaultState({
    lines: ['1 2 3 4 5'],
    cursor,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorDeleteAllRight.deleteAllRight(editor)).toMatchObject({
    lines: ['1 2 3'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})
