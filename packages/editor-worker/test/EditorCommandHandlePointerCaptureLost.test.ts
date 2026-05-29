import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

const EditorCommandHandlePointerCaptureLost = await import('../src/parts/EditorCommand/EditorCommandHandlePointerCaptureLost.ts')

test('handlePointerCaptureLost - clears selection auto move state', () => {
  const editor = {
    autoMoveSelectionState: {
      hasListener: true,
      position: {
        columnIndex: 1,
        rowIndex: 2,
      },
    },
    lineCache: [],
  }
  expect(EditorCommandHandlePointerCaptureLost.handlePointerCaptureLost(editor)).toEqual({
    autoMoveSelectionState: {
      hasListener: false,
      position: {
        columnIndex: 1,
        rowIndex: 2,
      },
    },
    lineCache: [],
  })
})
