import type { EditorState } from '../../State/State.ts'
import * as EditorFormat from '../EditorCommandFormat.ts'

export const getNewEditor = async (editor: EditorState, skipFormatting = false): Promise<EditorState> => {
  if (editor.formatOnSave && !skipFormatting) {
    return EditorFormat.format(editor)
  }
  return editor
}
