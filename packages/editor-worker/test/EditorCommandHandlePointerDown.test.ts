import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerDown from '../src/parts/EditorCommand/EditorCommandHandlePointerDown.ts'

test('handlePointerDown - sets collapsed selection like single click', async () => {
  const editor = {
    charWidth: 8,
    columnWidth: 8,
    cursorWidth: 2,
    deltaX: 0,
    deltaY: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    halfCursorWidth: 1,
    height: 200,
    hoverEnabled: false,
    isMonospaceFont: true,
    letterSpacing: 0,
    lineCache: [],
    lineHeight: 20,
    lines: ['hello world'],
    maxLineY: 10,
    minLineY: 0,
    rowHeight: 20,
    rowHeightIncludingMargin: 20,
    tabSize: 2,
    widgets: [],
    width: 400,
    x: 0,
    y: 0,
  }

  const result = await EditorCommandHandlePointerDown.handlePointerDown(editor as any, 0, false, false, 0, 0, 1)
  expect(result).toMatchObject({
    focused: true,
    isSelecting: true,
    selectionAnchorPosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})
