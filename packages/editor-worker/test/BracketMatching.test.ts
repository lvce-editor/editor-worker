import { expect, test } from '@jest/globals'
import { findBracketPair, findEnclosingBrackets, findMatchingBracket, findNextBracket } from '../src/parts/BracketMatching/BracketMatching.ts'

test.each([
  ['round brackets', ['(value)'], 0, 0, 0, 6],
  ['curly brackets', ['{value}'], 0, 0, 0, 6],
  ['square brackets', ['[value]'], 0, 0, 0, 6],
  ['nested mixed brackets', ['({[value]})'], 0, 0, 0, 10],
  ['multiline brackets', ['{', '  value', '}'], 0, 0, 2, 0],
] as const)('findMatchingBracket - %s', (name, lines, rowIndex, columnIndex, matchRowIndex, matchColumnIndex) => {
  expect(findMatchingBracket(lines, rowIndex, columnIndex)).toEqual({
    match: { columnIndex: matchColumnIndex, rowIndex: matchRowIndex },
    source: { columnIndex, rowIndex },
    sourceIsBeforeCursor: false,
  })
})

test('findMatchingBracket finds an opening bracket from its closing bracket', () => {
  expect(findMatchingBracket(['({x})'], 0, 4)).toEqual({
    match: { columnIndex: 0, rowIndex: 0 },
    source: { columnIndex: 4, rowIndex: 0 },
    sourceIsBeforeCursor: false,
  })
})

test('findMatchingBracket detects a bracket immediately before the cursor', () => {
  expect(findMatchingBracket(['(x)'], 0, 1)).toEqual({
    match: { columnIndex: 2, rowIndex: 0 },
    source: { columnIndex: 0, rowIndex: 0 },
    sourceIsBeforeCursor: true,
  })
})

test('findMatchingBracket prefers the bracket at the cursor', () => {
  expect(findMatchingBracket(['()[]'], 0, 2)).toEqual({
    match: { columnIndex: 3, rowIndex: 0 },
    source: { columnIndex: 2, rowIndex: 0 },
    sourceIsBeforeCursor: false,
  })
})

test.each([
  ['plain text', ['value'], 0, 2],
  ['a cursor beyond the document', ['value'], 1, 0],
  ['unmatched opening bracket', ['(value'], 0, 0],
  ['unmatched closing bracket', ['value)'], 0, 5],
  ['incorrect nesting', ['([)]'], 0, 0],
] as const)('findMatchingBracket returns undefined for %s', (name, lines, rowIndex, columnIndex) => {
  expect(findMatchingBracket(lines, rowIndex, columnIndex)).toBeUndefined()
})

test('findEnclosingBrackets returns the innermost mixed pair', () => {
  expect(findEnclosingBrackets(['({[value]})'], 0, 5)).toEqual({
    match: { columnIndex: 8, rowIndex: 0 },
    source: { columnIndex: 2, rowIndex: 0 },
    sourceIsBeforeCursor: false,
  })
})

test('findNextBracket searches across lines', () => {
  expect(findNextBracket(['value', 'next {'], 0, 2)).toEqual({ columnIndex: 5, rowIndex: 1 })
})

test('findBracketPair falls back from an enclosing pair to the next pair', () => {
  expect(findBracketPair(['value', 'next []'], 0, 2)).toEqual({
    match: { columnIndex: 6, rowIndex: 1 },
    source: { columnIndex: 5, rowIndex: 1 },
    sourceIsBeforeCursor: false,
  })
})
