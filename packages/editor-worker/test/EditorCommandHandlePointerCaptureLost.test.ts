import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerCaptureLost from '../src/parts/EditorCommand/EditorCommandHandlePointerCaptureLost.ts'

test('handlePointerCaptureLost - clears selection auto move state', () => {
  const editor = {
    hasListener: true,
    isSelecting: true,
    selectionAutoMovePosition: {
      columnIndex: 2,
      rowIndex: 3,
    },
  }
  expect(EditorCommandHandlePointerCaptureLost.handlePointerCaptureLost(editor)).toEqual({
    hasListener: false,
    isSelecting: false,
    selectionAutoMovePosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
  })
})
