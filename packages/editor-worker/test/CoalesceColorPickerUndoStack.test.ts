import { expect, test } from '@jest/globals'
import * as CoalesceColorPickerUndoStack from '../src/parts/CoalesceColorPickerUndoStack/CoalesceColorPickerUndoStack.ts'

test('coalesces all picker frames into one undo entry', () => {
  const originalChange = { deleted: ['#000'], inserted: ['#ff0000'], origin: 'colorPicker' }
  const latestChange = { deleted: ['#ff0000'], inserted: ['#00ff00'], origin: 'colorPicker' }
  expect(CoalesceColorPickerUndoStack.coalesceColorPickerUndoStack([[originalChange], [latestChange]], 0)).toEqual([
    [{ deleted: ['#000'], inserted: ['#00ff00'], origin: 'colorPicker' }],
  ])
})

test('preserves undo entries that predate the picker', () => {
  const previous = [{ origin: 'editorType' }]
  const originalChange = { deleted: ['#000'], inserted: ['#ff0000'] }
  const latestChange = { deleted: ['#ff0000'], inserted: ['#00ff00'] }
  expect(CoalesceColorPickerUndoStack.coalesceColorPickerUndoStack([previous, [originalChange], [latestChange]], 1)).toEqual([
    previous,
    [{ deleted: ['#000'], inserted: ['#00ff00'] }],
  ])
})

test('returns the original stack when no picker edit exists', () => {
  const undoStack: readonly any[] = []
  expect(CoalesceColorPickerUndoStack.coalesceColorPickerUndoStack(undoStack, 0)).toBe(undoStack)
})
