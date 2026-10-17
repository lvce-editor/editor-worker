import * as EditorCommandMoveRectangleSelectionPx from './EditorCommandMoveRectangleSelectionPx.ts'
import * as EditorCommandMoveSelectionPx from './EditorCommandMoveSelectionPx.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

export const handlePointerMove = async (editor: any, x: number, y: number, altKey: boolean) => {
  if (editor.textDragId) {
    const textDragDropPosition = await EditorPosition.at(editor, x, y)
    return {
      ...editor,
      textDragDropPosition,
    }
  }
  if (!editor.isSelecting) {
    return editor
  }
  if (altKey) {
    return EditorCommandMoveRectangleSelectionPx.moveRectangleSelectionPx(editor, x, y)
  }

  return EditorCommandMoveSelectionPx.moveSelectionPx(editor, x, y)
}
