import { expect, test } from '@jest/globals'
import * as EditorViewRows from '../src/parts/EditorViewRows/EditorViewRows.ts'

const conflict = {
  baseEndRowIndex: 3,
  baseStartRowIndex: 3,
  currentEndRowIndex: 3,
  currentStartRowIndex: 2,
  endRowIndex: 5,
  incomingEndRowIndex: 5,
  incomingStartRowIndex: 4,
  separatorRowIndex: 3,
  startRowIndex: 1,
}

test('inserts an actions row before each conflict marker', () => {
  expect(EditorViewRows.getViewLineIndices(7, () => false, [conflict])).toEqual([0, -2, 1, 2, 3, 4, 5, 6])
})

test('omits the actions row when its marker is folded', () => {
  expect(EditorViewRows.getViewLineIndices(7, (rowIndex) => rowIndex === 1, [conflict])).toEqual([0, 2, 3, 4, 5, 6])
})

test('maps between visual rows and document rows', () => {
  const viewRows = [0, -2, 1, 2, 3]
  expect(EditorViewRows.getVisualRowForDocumentRow(1, viewRows)).toBe(2)
  expect(EditorViewRows.getDocumentRowForVisualRow(1, viewRows)).toBe(1)
  expect(EditorViewRows.getDocumentRowForVisualRow(2, viewRows)).toBe(1)
})

test('slices a viewport while excluding action rows from document lines', () => {
  const visibleViewRows = EditorViewRows.getVisibleViewLineIndices([0, -2, 1, 2, 3], 1, 3)
  expect(visibleViewRows).toEqual([-2, 1, 2])
  expect(EditorViewRows.getVisibleLineIndices(visibleViewRows)).toEqual([1, 2])
})
