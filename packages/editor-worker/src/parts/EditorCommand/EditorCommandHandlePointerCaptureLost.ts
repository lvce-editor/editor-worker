import { DragAndDropWorker } from '@lvce-editor/rpc-registry'

// @ts-ignore
export const handlePointerCaptureLost = async (editor) => {
  if (editor.textDragId) {
    try {
      await DragAndDropWorker.invoke('DragAndDrop.discardTextDrag', editor.textDragId)
    } catch {
      // The pointer state still needs to be reset if the worker is unavailable.
    }
  }
  return {
    ...editor,
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
  }
}
