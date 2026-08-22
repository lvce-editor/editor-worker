import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { TextDragData } from '../TextDragData/TextDragData.ts'
import { moveTextDrag } from '../MoveTextDrag/MoveTextDrag.ts'

export const handlePointerUp = async (editor: any) => {
  const resetEditor = {
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
  if (!editor.textDragId) {
    return resetEditor
  }
  try {
    const data = (await DragAndDropWorker.invoke('DragAndDrop.takeTextDrag', editor.textDragId)) as TextDragData | undefined
    if (!data) {
      return resetEditor
    }
    return moveTextDrag(resetEditor, data, editor.textDragDropPosition)
  } catch {
    return resetEditor
  }
}
