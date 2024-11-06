import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const cursorCharacterLeft = (editor: any): any => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.characterLeft)
}
