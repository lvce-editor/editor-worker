import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getVisibleLineRange } from '../src/parts/ExternalGetPositionAtCursor/ExternalGetPositionAtCursor.ts'

test('returns the visible editor row range', () => {
  const editorUid = 1
  const editor = {
    lines: ['one', 'two', 'three', 'four'],
    maxLineY: 4,
    minLineY: 1,
    visibleLineIndices: [1, 2, 3],
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  expect(getVisibleLineRange(editorUid)).toEqual({
    endRowIndex: 3,
    startRowIndex: 1,
  })
})

test('uses the layout range when visible line indices are unavailable', () => {
  const editorUid = 2
  const editor = {
    lines: ['one', 'two', 'three'],
    maxLineY: 3,
    minLineY: 1,
    visibleLineIndices: [],
  }
  EditorStates.set(editorUid, editor as any, editor as any)

  expect(getVisibleLineRange(editorUid)).toEqual({
    endRowIndex: 2,
    startRowIndex: 1,
  })
})
