import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerUp from '../src/parts/EditorCommand/EditorCommandHandlePointerUp.ts'

test('handlePointerUp - clears selection auto move state', () => {
  const editor = {
    hasListener: true,
    isSelecting: true,
    selectionAutoMovePosition: {
      columnIndex: 2,
      rowIndex: 3,
    },
  }

  const result = EditorCommandHandlePointerUp.handlePointerUp(editor)

  expect(result).toEqual({
    hasListener: false,
    isSelecting: false,
    selectionAutoMovePosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
  })
})
