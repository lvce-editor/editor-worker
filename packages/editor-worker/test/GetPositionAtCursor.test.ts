import { expect, test } from '@jest/globals'
import { getPositionAtCursor } from '../src/parts/GetPositionAtCursor/GetPositionAtCursor.ts'

test('returns editor bounds alongside cursor coordinates for popup placement', () => {
  const editor = {
    columnWidth: 8,
    deltaY: 20,
    rowHeight: 20,
    selections: [2, 10, 2, 10],
    width: 180,
    x: 300,
    y: 50,
  }
  expect(getPositionAtCursor(editor)).toEqual({
    columnIndex: 10,
    editorWidth: 180,
    editorX: 300,
    rowIndex: 2,
    x: 380,
    y: 90,
  })
})
