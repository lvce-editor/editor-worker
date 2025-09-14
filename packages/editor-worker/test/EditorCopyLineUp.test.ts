import { expect, test } from '@jest/globals'
import * as EditorCopyLineUp from '../src/parts/EditorCommand/EditorCommandCopyLineUp.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorCopyLineUp', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([2, 0, 2, 0]),
    tokenizer: TokenizePlainText,
    undoStack: [],
    lineCache: [],
  }
  const newEditor = await EditorCopyLineUp.copyLineUp(editor)
  expect(newEditor.lines).toEqual(['line 1', 'line 2', 'line 3', 'line 3'])
  expect(newEditor.selections).toEqual(new Uint32Array([3, 0, 3, 0]))
})
