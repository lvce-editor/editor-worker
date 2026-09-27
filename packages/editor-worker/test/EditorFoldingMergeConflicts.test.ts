import { expect, test } from '@jest/globals'
import { updateLayout } from '../src/parts/EditorFolding/EditorFolding.ts'

const createEditor = (lines: readonly string[], mergeConflictActionsEnabled: boolean) => ({
  deltaY: 0,
  height: 80,
  itemHeight: 20,
  lines,
  mergeConflictActionsEnabled,
  minimumSliderSize: 20,
  numberOfVisibleLines: 4,
  rowHeight: 20,
})

test('keeps viewport-only layout data when merge conflict actions are disabled', () => {
  const editor = createEditor(['one', '<<<<<<< HEAD', 'current', '=======', 'incoming', '>>>>>>> branch', 'last'], false)
  const result = updateLayout(editor, [])

  expect(result.mergeConflicts).toEqual([])
  expect(result.viewLineIndices).toEqual([])
  expect(result.visibleLineIndices).toEqual([0, 1, 2, 3])
  expect(result.visibleViewLineIndices).toEqual([0, 1, 2, 3])
})

test('keeps viewport-only layout data when the setting is enabled without conflicts', () => {
  const editor = createEditor(['one', 'two', 'three', 'four', 'five'], true)
  const result = updateLayout(editor, [])

  expect(result.mergeConflicts).toEqual([])
  expect(result.viewLineIndices).toEqual([])
  expect(result.finalDeltaY).toBe(20)
})

test('adds conflict action rows to layout and scrollbar geometry', () => {
  const editor = createEditor(['one', '<<<<<<< HEAD', 'current', '=======', 'incoming', '>>>>>>> branch', 'last'], true)
  const result = updateLayout(editor, [])

  expect(result.mergeConflicts).toHaveLength(1)
  expect(result.viewLineIndices).toEqual([0, -2, 1, 2, 3, 4, 5, 6])
  expect(result.visibleLineIndices).toEqual([0, 1, 2])
  expect(result.visibleViewLineIndices).toEqual([0, -2, 1, 2])
  expect(result.finalDeltaY).toBe(80)
  expect(result.scrollBarHeight).toBe(40)
})
