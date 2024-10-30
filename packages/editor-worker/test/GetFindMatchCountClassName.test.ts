import { expect, test } from '@jest/globals'
import * as GetFindMatchCountClassName from '../src/parts/GetFindMatchCountClassName/GetFindMatchCountClassName.ts'

test('empty value, no results', () => {
  const matchCount = 0
  const value = ''
  expect(GetFindMatchCountClassName.getFindMatchCountClassName(matchCount, value)).toBe('FindMatchCount')
})

test('value, no results', () => {
  const matchCount = 0
  const value = 'a'
  expect(GetFindMatchCountClassName.getFindMatchCountClassName(matchCount, value)).toBe('FindMatchCount FindMatchCountEmpty')
})

test('value, results', () => {
  const matchCount = 1
  const value = 'a'
  expect(GetFindMatchCountClassName.getFindMatchCountClassName(matchCount, value)).toBe('FindMatchCount')
})