import { expect, test } from '@jest/globals'
import * as FindRegexMatches from '../src/parts/FindRegexMatches/FindRegexMatches.ts'

test('empty lines', () => {
  const lines: readonly string[] = []
  const regex = new RegExp('')
  expect(FindRegexMatches.findRegexMatches(lines, regex)).toEqual(new Uint32Array([]))
})
