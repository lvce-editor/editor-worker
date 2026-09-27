import { expect, test } from '@jest/globals'
import { getFormattingSelections } from '../src/parts/GetFormattingSelections/GetFormattingSelections.ts'

test('keeps all selections for unchanged formatting', () => {
  const selections = new Uint32Array([1, 3, 1, 3, 0, 5, 0, 2])
  expect(getFormattingSelections(['first', 'second'], ['first', 'second'], selections)).toBe(selections)
})

test('maps cursors through indentation changes before and after the cursor', () => {
  const lines = ['  {', '    "name": "example",', '  "version": "1.0.0"', '  }']
  const formatted = ['{', '  "name": "example",', '  "version": "1.0.0"', '}']
  expect(getFormattingSelections(lines, formatted, new Uint32Array([2, 5, 2, 5]))).toEqual(new Uint32Array([2, 5, 2, 5]))
})

test('maps reversed selections and multiple cursors across inserted lines', () => {
  expect(getFormattingSelections(['one two'], ['one', 'two'], new Uint32Array([0, 7, 0, 4, 0, 2, 0, 2]))).toEqual(
    new Uint32Array([1, 3, 1, 0, 0, 2, 0, 2]),
  )
})

test('maps a cursor in removed whitespace to the remaining indentation', () => {
  expect(getFormattingSelections(['    value'], ['  value'], new Uint32Array([0, 3, 0, 3]))).toEqual(new Uint32Array([0, 2, 0, 2]))
})

test('uses UTF-16 editor columns with astral characters', () => {
  expect(getFormattingSelections(['😀=1'], ['😀 = 1'], new Uint32Array([0, 4, 0, 4]))).toEqual(new Uint32Array([0, 6, 0, 6]))
})

test('clamps coordinates when unrelated replacement exceeds the diff limit', () => {
  expect(getFormattingSelections(['a'.repeat(1100), 'tail'], ['b'], new Uint32Array([1, 4, 1, 4]))).toEqual(new Uint32Array([0, 1, 0, 1]))
})
