import { expect, test } from '@jest/globals'
import { getMergeConflicts } from '../src/parts/GetMergeConflicts/GetMergeConflicts.ts'

test('detects a two-way merge conflict', () => {
  expect(getMergeConflicts(['before', '<<<<<<< HEAD', 'current', '=======', 'incoming', '>>>>>>> branch', 'after'])).toEqual([
    {
      baseEndRowIndex: 3,
      baseStartRowIndex: 3,
      currentEndRowIndex: 3,
      currentStartRowIndex: 2,
      endRowIndex: 5,
      incomingEndRowIndex: 5,
      incomingStartRowIndex: 4,
      separatorRowIndex: 3,
      startRowIndex: 1,
    },
  ])
})

test('detects a diff3 merge conflict', () => {
  expect(getMergeConflicts(['<<<<<<< HEAD', 'current', '||||||| base', 'original', '=======', 'incoming', '>>>>>>> branch'])).toEqual([
    expect.objectContaining({
      baseEndRowIndex: 4,
      baseStartRowIndex: 3,
      currentEndRowIndex: 2,
      currentStartRowIndex: 1,
      endRowIndex: 6,
      incomingEndRowIndex: 6,
      incomingStartRowIndex: 5,
      separatorRowIndex: 4,
      startRowIndex: 0,
    }),
  ])
})

test('detects multiple merge conflicts', () => {
  const lines = ['<<<<<<< HEAD', 'a', '=======', 'b', '>>>>>>> one', 'middle', '<<<<<<< HEAD', 'c', '=======', 'd', '>>>>>>> two']
  expect(getMergeConflicts(lines).map(({ endRowIndex, startRowIndex }) => ({ endRowIndex, startRowIndex }))).toEqual([
    { endRowIndex: 4, startRowIndex: 0 },
    { endRowIndex: 10, startRowIndex: 6 },
  ])
})

test.each([
  ['ordinary comparison text', ['value <<<<<<< other']],
  ['missing separator', ['<<<<<<< HEAD', 'current', '>>>>>>> branch']],
  ['missing end marker', ['<<<<<<< HEAD', 'current', '=======', 'incoming']],
  ['nested start marker', ['<<<<<<< HEAD', 'current', '<<<<<<< nested', '=======', 'incoming', '>>>>>>> branch']],
])('ignores %s', (_name, lines) => {
  expect(getMergeConflicts(lines)).toEqual([])
})
