import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const cursorWordRight = (editor: any) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(editor, EditorDelta.wordRight)
}
