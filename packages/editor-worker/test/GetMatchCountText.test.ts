import { expect, test } from '@jest/globals'
import * as GetMatchCountText from '../src/parts/GetMatchCountText/GetMatchCountText.ts'

test('no matches', () => {
  const matchIndex = 0
  const matchCount = 0
  expect(GetMatchCountText.getMatchCountText(matchIndex, matchCount)).toBe('No Results')
})

test('first match', () => {
  const matchIndex = 0
  const matchCount = 1
  expect(GetMatchCountText.getMatchCountText(matchIndex, matchCount)).toBe('1 of 1')
})
