import { expect, test } from '@jest/globals'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import * as EditorCommandHandlePointerCaptureLost from '../src/parts/EditorCommand/EditorCommandHandlePointerCaptureLost.ts'

test('handlePointerCaptureLost - clears selection auto move state', async () => {
  const editor = {
    hasListener: true,
    isSelecting: true,
    selectionAutoMovePosition: { x: 2, y: 3 },
  }
  await expect(EditorCommandHandlePointerCaptureLost.handlePointerCaptureLost(editor)).resolves.toEqual({
    hasListener: false,
    isSelecting: false,
    selectionAutoMovePosition: { x: 0, y: 0 },
    textDragDropPosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
    textDragId: 0,
  })
})

test('handlePointerCaptureLost - discards an active text drag session', async () => {
  using mockRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.discardTextDrag'() {},
  })
  const editor = {
    hasListener: true,
    isSelecting: false,
    selectionAutoMovePosition: { x: 0, y: 0 },
    textDragId: 12,
  }

  const result = await EditorCommandHandlePointerCaptureLost.handlePointerCaptureLost(editor)

  expect(result.textDragId).toBe(0)
  expect(mockRpc.invocations).toEqual([['DragAndDrop.discardTextDrag', 12]])
})
