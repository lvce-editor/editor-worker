import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getVisibleLineRange } from '../src/parts/ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts'

test('returns the visible editor row range with an exclusive end', () => {
  const editorUid = 1
  const editor = {
    lines: ['one', 'two', 'three', 'four'],
    maxLineY: 4,
    minLineY: 1,
    visibleLineIndices: [1, 2, 3],
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  expect(getVisibleLineRange(editorUid)).toEqual([1, 4])
})
