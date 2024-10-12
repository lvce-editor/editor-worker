import { expect, test } from '@jest/globals'
import * as FindStrings from '../src/parts/FindStrings/FindStrings.ts'

test('noResults', () => {
  expect(FindStrings.noResults()).toBe('No Results')
})

test('matchOf', () => {
  const matchIndex = 1
  const matchCount = 1
  expect(FindStrings.matchOf(matchIndex, matchCount)).toBe('1 of 1')
})

test('matchesFoundFor', () => {
  const matchIndex = 1
  const matchCount = 1
  const value = 'a'
  expect(FindStrings.matchesFoundFor(matchIndex, matchCount, value)).toBe('1 of 1 found for a')
})
