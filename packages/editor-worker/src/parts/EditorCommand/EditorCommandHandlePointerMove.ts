import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts'
import * as EditorCommandMoveRectangleSelectionPx from './EditorCommandMoveRectangleSelectionPx.ts'
import * as EditorCommandMoveSelectionPx from './EditorCommandMoveSelectionPx.ts'

export const handlePointerMove = async (editor: any, x: number, y: number, altKey: boolean) => {
  if (!EditorSelectionAutoMoveState.isSelecting()) {
    return editor
  }
  if (altKey) {
    return EditorCommandMoveRectangleSelectionPx.moveRectangleSelectionPx(editor, x, y)
  }

  return EditorCommandMoveSelectionPx.moveSelectionPx(editor, x, y)
}
