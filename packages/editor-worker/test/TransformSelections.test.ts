import { expect, test } from '@jest/globals'
import { transformSelections } from '../src/parts/TransformSelections/TransformSelections.ts'

const change = (startRowIndex: number, startColumnIndex: number, endRowIndex: number, endColumnIndex: number, inserted: readonly string[]) => ({
  deleted: [''],
  end: {
    columnIndex: endColumnIndex,
    rowIndex: endRowIndex,
  },
  inserted,
  start: {
    columnIndex: startColumnIndex,
    rowIndex: startRowIndex,
  },
})

test('keeps a selection before an edit unchanged', () => {
  const selections = new Uint32Array([0, 1, 0, 2])

  const result = transformSelections(selections, [change(0, 3, 0, 3, ['x'])])

  expect(result).toEqual(new Uint32Array([0, 1, 0, 2]))
})

test('moves a cursor after a same-line insertion', () => {
  const selections = new Uint32Array([0, 5, 0, 5])

  const result = transformSelections(selections, [change(0, 2, 0, 2, ['abc'])])

  expect(result).toEqual(new Uint32Array([0, 8, 0, 8]))
})

test('moves a cursor at an insertion point after the inserted text', () => {
  const selections = new Uint32Array([0, 2, 0, 2])

  const result = transformSelections(selections, [change(0, 2, 0, 2, ['abc'])])

  expect(result).toEqual(new Uint32Array([0, 5, 0, 5]))
})

test('moves a cursor after a multiline insertion', () => {
  const selections = new Uint32Array([0, 5, 0, 5])

  const result = transformSelections(selections, [change(0, 2, 0, 2, ['a', 'bc'])])

  expect(result).toEqual(new Uint32Array([1, 5, 1, 5]))
})

test('moves a cursor after a multiline deletion', () => {
  const selections = new Uint32Array([2, 3, 2, 3])

  const result = transformSelections(selections, [
    {
      ...change(0, 2, 1, 4, ['x']),
      deleted: ['first', 'second'],
    },
  ])

  expect(result).toEqual(new Uint32Array([1, 3, 1, 3]))
})

test('moves a selection inside replaced text to the replacement end', () => {
  const selections = new Uint32Array([0, 3, 0, 4])

  const result = transformSelections(selections, [change(0, 2, 0, 5, ['x'])])

  expect(result).toEqual(new Uint32Array([0, 3, 0, 3]))
})

test('applies multiple changes in document order', () => {
  const selections = new Uint32Array([1, 2, 1, 2])

  const result = transformSelections(selections, [change(0, 0, 0, 0, ['new', '']), change(1, 0, 1, 0, ['x'])])

  expect(result).toEqual(new Uint32Array([2, 3, 2, 3]))
})
