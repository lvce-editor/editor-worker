import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const cursorCharacterRight = (editor: any) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(editor, EditorDelta.characterRight)
}

export const cursorRight = cursorCharacterRight
