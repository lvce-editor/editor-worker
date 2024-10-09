import { expect, test } from '@jest/globals'
import * as FindMatchesCaseInsensitive from '../src/parts/FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.ts'

test('empty string', () => {
  const lines: readonly string[] = []
  const searchValue = ''
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, searchValue)).toEqual(new Uint32Array([]))
})

test('empty lines', () => {
  const lines: readonly string[] = []
  const searchValue = 'abc'
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, searchValue)).toEqual(new Uint32Array([]))
})

test('single match', () => {
  const lines: readonly string[] = ['abc']
  const searchValue = 'abc'
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, searchValue)).toEqual(new Uint32Array([0, 0]))
})

test('multiple matches', () => {
  const lines: readonly string[] = ['abc', 'abc']
  const searchValue = 'abc'
  expect(FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, searchValue)).toEqual(new Uint32Array([0, 0, 1, 0]))
})
