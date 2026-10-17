import { expect, test } from '@jest/globals'
import { getIndentString } from '../src/parts/GetIndentString/GetIndentString.ts'

test('getIndentString returns configured spaces', () => {
  expect(getIndentString({ insertSpaces: true, tabSize: 4 })).toBe(' '.repeat(4))
})

test('getIndentString returns a tab', () => {
  expect(getIndentString({ insertSpaces: false, tabSize: 4 })).toBe('\t')
})
