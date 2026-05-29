import * as EditorCommandMoveRectangleSelectionPx from './EditorCommandMoveRectangleSelectionPx.ts'
import * as EditorCommandMoveSelectionPx from './EditorCommandMoveSelectionPx.ts'

export const handlePointerMove = (editor: any, x: number, y: number, altKey: boolean) => {
  if (altKey) {
    return EditorCommandMoveRectangleSelectionPx.moveRectangleSelectionPx(editor, x, y)
  }
  return EditorCommandMoveSelectionPx.moveSelectionPx(editor, x, y)
}
