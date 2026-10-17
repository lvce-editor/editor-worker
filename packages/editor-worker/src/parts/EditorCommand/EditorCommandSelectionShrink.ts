import type { EditorState } from '../State/State.ts'
import { cursorUndo } from './EditorCommandCursorUndo.ts'

export const selectionShrink = (editor: EditorState): EditorState => {
  return cursorUndo(editor)
}
