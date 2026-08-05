import { expect, test } from '@jest/globals'
import { cursorUndo } from '../src/parts/EditorCommand/EditorCommandCursorUndo.ts'

test('returns the editor unchanged until cursor history is available', () => {
  const editor = {
    selections: new Uint32Array([0, 0, 0, 0]),
  }

  expect(cursorUndo(editor as any)).toBe(editor)
})
