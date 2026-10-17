import { expect, test } from '@jest/globals'
import { selectionShrink } from '../src/parts/EditorCommand/EditorCommandSelectionShrink.ts'

test('returns the editor unchanged when selection history is empty', () => {
  const editor = {
    selections: new Uint32Array([0, 0, 0, 0]),
  }

  expect(selectionShrink(editor as any)).toBe(editor)
})

test('restores smart selections in reverse order', () => {
  const cursor = new Uint32Array([0, 12, 0, 12])
  const identifier = new Uint32Array([0, 11, 0, 13])
  const call = new Uint32Array([0, 3, 0, 14])
  const editor = {
    cursorUndoStack: [cursor, identifier],
    selections: call,
  }

  const firstResult = selectionShrink(editor as any)
  const secondResult = selectionShrink(firstResult)

  expect(firstResult.selections).toBe(identifier)
  expect(firstResult.cursorUndoStack).toEqual([cursor])
  expect(secondResult.selections).toBe(cursor)
  expect(secondResult.cursorUndoStack).toEqual([])
})
