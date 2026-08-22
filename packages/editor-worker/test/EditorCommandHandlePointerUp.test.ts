import { expect, test } from '@jest/globals'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import * as EditorCommandHandlePointerUp from '../src/parts/EditorCommand/EditorCommandHandlePointerUp.ts'

test('handlePointerUp - clears selection auto move state', async () => {
  const editor = {
    hasListener: true,
    isSelecting: true,
    selectionAutoMovePosition: {
      columnIndex: 2,
      rowIndex: 3,
    },
  }

  const result = await EditorCommandHandlePointerUp.handlePointerUp(editor)

  expect(result).toEqual({
    hasListener: false,
    isSelecting: false,
    selectionAutoMovePosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
    textDragDropPosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
    textDragId: 0,
  })
})

test('handlePointerUp - consumes a text drag session on a no-op drop', async () => {
  using mockRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.takeTextDrag'() {
      return {
        endOffset: 5,
        sourceUri: 'file:///workspace/file.txt',
        startOffset: 0,
        text: 'hello',
      }
    },
  })
  const editor = {
    hasListener: true,
    isSelecting: false,
    lines: ['hello world'],
    selectionAutoMovePosition: { columnIndex: 0, rowIndex: 0 },
    textDragDropPosition: { columnIndex: 2, rowIndex: 0 },
    textDragId: 9,
    uri: 'file:///workspace/file.txt',
  }

  const result = await EditorCommandHandlePointerUp.handlePointerUp(editor)

  expect(result).toMatchObject({ textDragId: 0 })
  expect(mockRpc.invocations).toEqual([['DragAndDrop.takeTextDrag', 9]])
})

test('handlePointerUp - resets pointer state when the text drag session is missing', async () => {
  using _mockRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.takeTextDrag'() {},
  })
  const editor = {
    hasListener: true,
    isSelecting: false,
    selectionAutoMovePosition: { columnIndex: 3, rowIndex: 2 },
    textDragDropPosition: { columnIndex: 8, rowIndex: 0 },
    textDragId: 4,
  }

  const result = await EditorCommandHandlePointerUp.handlePointerUp(editor)

  expect(result).toMatchObject({
    hasListener: false,
    textDragDropPosition: { columnIndex: 0, rowIndex: 0 },
    textDragId: 0,
  })
})
