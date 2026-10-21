import { moveBidiCharacter } from '../MoveBidiCharacter/MoveBidiCharacter.ts'
import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const cursorCharacterLeft = (editor: any): any => {
  const bidi = moveBidiCharacter(editor, -1, false)
  if (bidi) {
    return bidi
  }
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.characterLeft)
}
