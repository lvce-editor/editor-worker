import { expect, test } from '@jest/globals'
import * as GetSearchRegex from '../src/parts/GetSearchRegex/GetSearchRegex.ts'

test('character', () => {
  const value = 'a'
  expect(GetSearchRegex.getSearchRegex(value)).toEqual(new RegExp('a', 'gi'))
})

test('plus', () => {
  const value = '+'
  expect(GetSearchRegex.getSearchRegex(value)).toEqual(new RegExp('\\+', 'gi'))
})
