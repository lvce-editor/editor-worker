import { moveBidiCharacter } from '../MoveBidiCharacter/MoveBidiCharacter.ts'
import * as EditorDelta from './EditorCommandDelta.ts'
import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.ts'

export const selectCharacterRight = (editor: any) => {
  const bidi = moveBidiCharacter(editor, 1, true)
  if (bidi) {
    return bidi
  }
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDelta.characterRight)
}
