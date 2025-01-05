import * as EditorDelta from './EditorCommandDelta.ts'
import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.ts'

export const selectCharacterRight = (editor: any) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDelta.characterRight)
}
