import { expect, test } from '@jest/globals'
import * as SplitLines from '../src/parts/SplitLines/SplitLines.js'

test('splitLines - undefined', () => {
  expect(SplitLines.splitLines(undefined)).toEqual([])
})

test('splitLines - empty string', () => {
  expect(SplitLines.splitLines('')).toEqual([])
})

test('splitLines - single line', () => {
  expect(SplitLines.splitLines('abc')).toEqual(['abc'])
})
