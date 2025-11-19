import * as EditorMoveRectangleSelection from './EditorCommandMoveRectangleSelection.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

// @ts-ignore
export const moveRectangleSelectionPx = async (editor, x, y) => {
  const position = await EditorPosition.at(editor, x, y)
  EditorMoveRectangleSelection.moveRectangleSelection(editor, position)
}
