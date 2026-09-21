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

test('hot reload captures draft status and cursor state separately from ordinary persistence', () => {
  const state = {
    deltaY: 42,
    endOfLine: 'crlf',
    lines: ['draft'],
    modified: true,
    redoStack: [],
    selections: new Uint32Array([0, 1, 0, 3]),
    undoStack: [],
  }
  expect(saveState(state as any, true)).toEqual({ ...state, hotReload: true, selections: [0, 1, 0, 3] })
  expect(saveState(state as any, undefined)).not.toHaveProperty('hotReload')
})
