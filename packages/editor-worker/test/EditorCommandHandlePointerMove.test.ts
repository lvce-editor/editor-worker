import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerMove from '../src/parts/EditorCommand/EditorCommandHandlePointerMove.ts'

test('handlePointerMove - ignores moves after selection stopped', async () => {
  const editor = {
    isSelecting: false,
  }

  const result = await EditorCommandHandlePointerMove.handlePointerMove(editor, 0, 0, false)

  expect(result).toBe(editor)
})

test('handlePointerMove - updates the text drag drop position', async () => {
  const editor = {
    charWidth: 8,
    deltaX: 0,
    deltaY: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    isMonospaceFont: true,
    isSelecting: false,
    letterSpacing: 0,
    lines: ['hello world'],
    rowHeight: 20,
    tabSize: 2,
    textDragId: 7,
    x: 0,
    y: 0,
  }

  const result = await EditorCommandHandlePointerMove.handlePointerMove(editor, 80, 0, false)

  expect(result).toEqual({
    ...editor,
    textDragDropPosition: { columnIndex: 10, rowIndex: 0 },
  })
})
