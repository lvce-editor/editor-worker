import { expect, test } from '@jest/globals'
import * as InverseChange from '../src/parts/InverseChange/InverseChange.ts'

test('inverseChange - multiline inserted text', () => {
  const change = {
    deleted: ['one'],
    end: {
      columnIndex: 3,
      rowIndex: 0,
    },
    inserted: ['one', 'one'],
    start: {
      columnIndex: 0,
      rowIndex: 0,
    },
  }

  expect(InverseChange.inverseChange(change)).toEqual({
    deleted: ['one', 'one'],
    end: {
      columnIndex: 3,
      rowIndex: 1,
    },
    inserted: ['one'],
    start: {
      columnIndex: 0,
      rowIndex: 0,
    },
  })
})

test('inverseChange - single-line inserted text', () => {
  const change = {
    deleted: [''],
    end: {
      columnIndex: 2,
      rowIndex: 0,
    },
    inserted: ['x'],
    start: {
      columnIndex: 2,
      rowIndex: 0,
    },
  }

  expect(InverseChange.inverseChange(change)).toEqual({
    deleted: ['x'],
    end: {
      columnIndex: 3,
      rowIndex: 0,
    },
    inserted: [''],
    start: {
      columnIndex: 2,
      rowIndex: 0,
    },
  })
})
