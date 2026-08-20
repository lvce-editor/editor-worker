import { expect, test } from '@jest/globals'
import * as GetDiagnosticNavigationIndex from '../src/parts/GetDiagnosticNavigationIndex/GetDiagnosticNavigationIndex.ts'

const createDiagnostic = (rowIndex: number, columnIndex: number, message: string) => ({
  code: 1,
  columnIndex,
  endColumnIndex: columnIndex + 2,
  endRowIndex: rowIndex,
  message,
  rowIndex,
  source: 'test',
  type: 'error',
  uri: 'file:///test.ts',
})

const first = createDiagnostic(1, 5, 'first')
const second = createDiagnostic(3, 2, 'second')
const third = createDiagnostic(8, 1, 'third')
const diagnostics = [third, first, second]

test('finds the next diagnostic in source order', () => {
  expect(GetDiagnosticNavigationIndex.getDiagnosticNavigationIndex(diagnostics, new Uint32Array([1, 5, 1, 5]), undefined, 1)).toEqual({
    diagnostic: second,
    index: 1,
  })
})

test('finds the previous diagnostic in source order', () => {
  expect(GetDiagnosticNavigationIndex.getDiagnosticNavigationIndex(diagnostics, new Uint32Array([8, 1, 8, 1]), undefined, -1)).toEqual({
    diagnostic: second,
    index: 1,
  })
})

test('wraps forward after the final diagnostic', () => {
  expect(GetDiagnosticNavigationIndex.getDiagnosticNavigationIndex(diagnostics, new Uint32Array([20, 0, 20, 0]), undefined, 1)).toEqual({
    diagnostic: first,
    index: 0,
  })
})

test('wraps backward before the first diagnostic', () => {
  expect(GetDiagnosticNavigationIndex.getDiagnosticNavigationIndex(diagnostics, new Uint32Array([0, 0, 0, 0]), undefined, -1)).toEqual({
    diagnostic: third,
    index: 2,
  })
})

test('advances through diagnostics that share a range', () => {
  const overlapping = createDiagnostic(1, 5, 'overlapping')
  const sameRange = [first, overlapping, second]
  const selection = new Uint32Array([first.rowIndex, first.columnIndex, first.endRowIndex, first.endColumnIndex])

  expect(GetDiagnosticNavigationIndex.getDiagnosticNavigationIndex(sameRange, selection, first, 1)).toEqual({
    diagnostic: overlapping,
    index: 1,
  })
})

test('returns no result when there are no diagnostics', () => {
  expect(GetDiagnosticNavigationIndex.getDiagnosticNavigationIndex([], new Uint32Array([0, 0, 0, 0]), undefined, 1)).toBeUndefined()
})
