import { expect, test } from '@jest/globals'
import * as EditorCommandBraceCompletion from '../src/parts/EditorCommand/EditorCommandBraceCompletion.ts'

test('getCursorOffset returns the offset at the editor cursor', () => {
  const editor = {
    lines: ['ab', 'cd'],
    selections: new Uint32Array([1, 1, 1, 1]),
  }

  expect(EditorCommandBraceCompletion.getCursorOffset(editor)).toBe(4)
})
