import { expect, test } from '@jest/globals'
import * as GetWordMatchAtPosition from '../src/parts/GetWordMatchAtPosition/GetWordMatchAtPosition.ts'

test('full word', () => {
  const lines = ['abc']
  const rowIndex = 0
  const columnIndex = 0
  expect(GetWordMatchAtPosition.getWordMatchAtPosition(lines, rowIndex, columnIndex)).toEqual({
    end: 3,
    start: 0,
    word: 'abc',
  })
})
