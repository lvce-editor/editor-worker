import { expect, test } from '@jest/globals'
import { getEndOfLine } from '../src/parts/GetEndOfLine/GetEndOfLine.ts'

test('getEndOfLine detects LF', () => {
  expect(getEndOfLine('one\ntwo')).toBe('lf')
})

test('getEndOfLine detects CRLF', () => {
  expect(getEndOfLine('one\r\ntwo')).toBe('crlf')
})
