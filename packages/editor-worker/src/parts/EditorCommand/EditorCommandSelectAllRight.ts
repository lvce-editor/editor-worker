import * as EditorDelta from './EditorCommandDelta.ts'
import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.ts'

// @ts-ignore
export const editorSelectAllRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDelta.lineEnd)
}
