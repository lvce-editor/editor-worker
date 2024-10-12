import { expect, test } from '@jest/globals'
import * as FindRegexMatches from '../src/parts/FindRegexMatches/FindRegexMatches.ts'

test('empty lines', () => {
  const lines: readonly string[] = []
  const regex = new RegExp('')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([]))
})

test.only('match in one line', () => {
  const lines: readonly string[] = ['a']
  const regex = new RegExp('a')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([0, 0]))
})

test('two matches in one line', () => {
  const lines: readonly string[] = ['a a']
  const regex = new RegExp('a')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([0, 0]))
})

test('three matches in one line', () => {
  const lines: readonly string[] = ['a a a']
  const regex = new RegExp('a')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([0, 0]))
})
