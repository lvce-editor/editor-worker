import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as EditorCopyLineDown from '../src/parts/EditorCommand/EditorCommandCopyLineDown.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorCopyLineDown - cursor at start of line', async () => {
  const editor = createDefaultState({
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCopyLineDown - cursor in middle of line', async () => {
  const editor = createDefaultState({
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
    tokenizer: TokenizePlainText,
  })
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})
