import { moveBidiCharacter } from '../MoveBidiCharacter/MoveBidiCharacter.ts'
import * as EditorDelta from './EditorCommandDelta.ts'
import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.ts'

// @ts-ignore
export const selectCharacterLeft = (editor) => {
  const bidi = moveBidiCharacter(editor, -1, true)
  if (bidi) {
    return bidi
  }
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.characterLeft)
}
