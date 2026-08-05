import { expect, test } from '@jest/globals'
import { saveState } from '../src/parts/SaveState/SaveState.ts'

test('saveState preserves document history', () => {
  const lines = ['first line', 'second line']
  const redoStack = [['redo change']]
  const undoStack = [['undo change']]

  expect(saveState({ lines, redoStack, undoStack } as any, undefined)).toEqual({
    lines,
    redoStack,
    undoStack,
  })
})
