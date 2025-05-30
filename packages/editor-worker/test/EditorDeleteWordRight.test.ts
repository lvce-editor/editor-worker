import { expect, test } from '@jest/globals'
import * as EditorDeleteWordRight from '../src/parts/EditorCommand/EditorCommandDeleteWordRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorDeleteWordRight', async () => {
  const editor = {
    lines: ['sample text'],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
    tokenizer: TokenizePlainText,
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorDeleteWordRight.deleteWordRight(editor)).toMatchObject({
    lines: ['sample '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test.skip('editorDeleteWordRight - when there is not word right', async () => {
  const editor = {
    lines: ['sample   '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteWordRight.deleteWordRight(editor)).toMatchObject({
    lines: ['sample  '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})
