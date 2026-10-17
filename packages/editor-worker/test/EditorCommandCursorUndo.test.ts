import { expect, test } from '@jest/globals'
import { cursorUndo } from '../src/parts/EditorCommand/EditorCommandCursorUndo.ts'

test('returns the editor unchanged when cursor history is empty', () => {
  const editor = {
    selections: new Uint32Array([0, 0, 0, 0]),
  }

  expect(cursorUndo(editor as any)).toBe(editor)
})

test('restores cursor history entries in reverse order', () => {
  const firstSelections = new Uint32Array([0, 0, 0, 0])
  const secondSelections = new Uint32Array([0, 2, 0, 2])
  const editor = {
    cursorUndoStack: [firstSelections, secondSelections],
    selections: new Uint32Array([0, 4, 0, 4]),
  }

  const firstResult = cursorUndo(editor as any)
  const secondResult = cursorUndo(firstResult)

  expect(firstResult.selections).toBe(secondSelections)
  expect(firstResult.cursorUndoStack).toEqual([firstSelections])
  expect(secondResult.selections).toBe(firstSelections)
  expect(secondResult.cursorUndoStack).toEqual([])
})
