import { expect, test } from '@jest/globals'
import * as FindRegexMatches from '../src/parts/FindRegexMatches/FindRegexMatches.ts'

test('empty lines', () => {
  const lines: readonly string[] = []
  const regex = new RegExp('', 'g')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([]))
})

test('non global regex', () => {
  const lines: readonly string[] = ['a']
  const regex = new RegExp('a')
  expect(() => FindRegexMatches.findRegexMatches(lines, regex)).toThrow(new Error('regex must be global'))
})

test('match in one line', () => {
  const lines: readonly string[] = ['a']
  const regex = new RegExp('a', 'g')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([0, 0]))
})

test('two matches in one line', () => {
  const lines: readonly string[] = ['a a']
  const regex = new RegExp('a', 'g')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([0, 0, 0, 2]))
})

test('three matches in one line', () => {
  const lines: readonly string[] = ['a a a']
  const regex = new RegExp('a', 'g')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([0, 0, 0, 2, 0, 4]))
})

test('matches in multiple lines', () => {
  const lines: readonly string[] = ['a', 'a']
  const regex = new RegExp('a', 'g')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([0, 0, 1, 0]))
})
