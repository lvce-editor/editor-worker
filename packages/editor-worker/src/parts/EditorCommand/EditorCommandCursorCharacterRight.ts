import { moveBidiCharacter } from '../MoveBidiCharacter/MoveBidiCharacter.ts'
import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const cursorCharacterRight = (editor: any) => {
  const bidi = moveBidiCharacter(editor, 1, false)
  if (bidi) {
    return bidi
  }
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(editor, EditorDelta.characterRight)
}
