import { expect, test } from '@jest/globals'
import { applyLineEndings, normalizeLineEndings } from '../src/parts/NormalizeLineEndings/NormalizeLineEndings.ts'

test('normalizeLineEndings converts CRLF and CR to LF', () => {
  expect(normalizeLineEndings('one\r\ntwo\rthree')).toBe('one\ntwo\nthree')
})

test('applyLineEndings writes LF', () => {
  expect(applyLineEndings('one\r\ntwo\r\n', 'lf')).toBe('one\ntwo\n')
})

test('applyLineEndings writes CRLF', () => {
  expect(applyLineEndings('one\ntwo\n', 'crlf')).toBe('one\r\ntwo\r\n')
})
