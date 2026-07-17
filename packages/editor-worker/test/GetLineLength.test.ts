import { expect, test } from '@jest/globals'
import * as GetLineLength from '../src/parts/GetLineLength/GetLineLength.ts'

test('getLineLength returns regular line length', () => {
  expect(GetLineLength.getLineLength('first')).toBe(5)
})

test('getLineLength excludes a trailing carriage return', () => {
  expect(GetLineLength.getLineLength('first\r')).toBe(5)
})
