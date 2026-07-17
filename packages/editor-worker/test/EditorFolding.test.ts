import { expect, test } from '@jest/globals'
import {
  addRange,
  findRange,
  getDocumentRowForVisualRow,
  getViewportLineIndices,
  getVisibleLineCount,
  getVisualRowForDocumentRow,
} from '../src/parts/EditorFolding/EditorFolding.ts'

const ranges = [{ end: 4, start: 1 }]

test('maps document rows around a folded range', () => {
  expect(getVisibleLineCount(7, ranges)).toBe(4)
  expect(getVisualRowForDocumentRow(5, ranges)).toBe(2)
  expect(getDocumentRowForVisualRow(2, ranges)).toBe(5)
  expect(getViewportLineIndices(7, ranges, 0, 4)).toEqual([0, 1, 5, 6])
})

test('maps document rows around multiple folded ranges', () => {
  const multipleRanges = [
    { end: 3, start: 1 },
    { end: 8, start: 6 },
  ]
  expect(getVisibleLineCount(10, multipleRanges)).toBe(6)
  expect(getVisualRowForDocumentRow(6, multipleRanges)).toBe(4)
  expect(getVisualRowForDocumentRow(9, multipleRanges)).toBe(5)
  expect(getDocumentRowForVisualRow(4, multipleRanges)).toBe(6)
  expect(getDocumentRowForVisualRow(5, multipleRanges)).toBe(9)
  expect(getViewportLineIndices(10, multipleRanges, 0, 6)).toEqual([0, 1, 4, 5, 6, 9])
})

test('adding an outer range replaces nested ranges', () => {
  expect(addRange([{ end: 3, start: 1 }], { end: 4, start: 0 })).toEqual([{ end: 4, start: 0 }])
})

test('adding a nested range to an existing fold has no effect', () => {
  const existing = [{ end: 4, start: 0 }]
  expect(addRange(existing, { end: 3, start: 1 })).toBe(existing)
})

test('finds the innermost multiline brace range', () => {
  expect(findRange(['function outer() {', '  if (ready) {', '    run()', '  }', '}'], 2)).toEqual({
    end: 3,
    start: 1,
  })
})

test('ignores braces in comments and strings', () => {
  expect(findRange(['function run() {', '  const value = "}"', '  // }', '}'], 1)).toEqual({
    end: 3,
    start: 0,
  })
})
