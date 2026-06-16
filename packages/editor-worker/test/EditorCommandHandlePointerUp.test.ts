import { expect, test } from '@jest/globals'
import * as EditorCommandHandlePointerUp from '../src/parts/EditorCommand/EditorCommandHandlePointerUp.ts'

test('handlePointerUp - clears selection auto move state', () => {
  const editor = {
    autoMoveSelectionState: {
      hasListener: true,
      position: {
        columnIndex: 3,
        rowIndex: 4,
      },
    },
  }

  const result = EditorCommandHandlePointerUp.handlePointerUp(editor)

  expect(result).toEqual({
    autoMoveSelectionState: {
      hasListener: false,
      position: {
        columnIndex: 3,
        rowIndex: 4,
      },
    },
  })
})
