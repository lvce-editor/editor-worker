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

test('marks the lightbulb row and preserves breakpoint state', () => {
  expect(getGutterInfos(1, 4, [2], true, undefined, 2)).toEqual([
    2,
    {
      isBreakpoint: true,
      isLightBulb: true,
      lineNumber: 3,
    },
    4,
  ])
})

test('includes gutter decorations on matching rows', () => {
  expect(
    getGutterInfos(0, 3, [], true, undefined, -1, [
      { rowIndex: 0, type: 'added' },
      { rowIndex: 2, type: 'modified' },
    ]),
  ).toEqual([
    {
      gutterDecorations: [{ rowIndex: 0, type: 'added' }],
      lineNumber: 1,
      showLineNumber: true,
    },
    2,
    {
      gutterDecorations: [{ rowIndex: 2, type: 'modified' }],
      lineNumber: 3,
      showLineNumber: true,
    },
  ])
})

test('preserves gutter decorations when line numbers are hidden', () => {
  expect(getGutterInfos(0, 1, [], false, undefined, -1, [{ rowIndex: 0, type: 'deleted' }])).toEqual([
    {
      gutterDecorations: [{ rowIndex: 0, type: 'deleted' }],
      lineNumber: 1,
      showLineNumber: false,
    },
  ])
})

test('adds an unnumbered gutter row for merge conflict actions', () => {
  expect(getGutterInfos(0, 2, [], true, [0, -2, 1])).toEqual([1, { isMergeConflictActions: true, lineNumber: 0, showLineNumber: false }, 2])
})
