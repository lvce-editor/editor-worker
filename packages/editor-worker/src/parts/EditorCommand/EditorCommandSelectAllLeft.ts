import * as EditorDelta from './EditorCommandDelta.ts'
import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.ts'

// @ts-ignore
export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.lineCharacterStart)
}
