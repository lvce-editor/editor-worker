import * as EditorDelta from './EditorCommandDelta.ts'
import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.ts'

// @ts-ignore
export const selectCharacterLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.characterLeft)
}
