import { expect, test } from '@jest/globals'
import { getGutterInfos } from '../src/parts/GetGutterInfos/GetGutterInfos.ts'

test('marks breakpoint rows in the visible gutter', () => {
  expect(getGutterInfos(1, 4, [2])).toEqual([
    2,
    {
      isBreakpoint: true,
      lineNumber: 3,
    },
    4,
  ])
})

test('hides line numbers while preserving breakpoint markers', () => {
  expect(getGutterInfos(0, 2, [1], false)).toEqual([
    '',
    {
      isBreakpoint: true,
      lineNumber: 2,
    },
  ])
})
