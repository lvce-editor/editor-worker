import type { EditorState } from '../../State/State.ts'
import * as EditorFormat from '../EditorCommandFormat.ts'

export const getNewEditor = async (editor: EditorState): Promise<EditorState> => {
  if (editor.formatOnSave) {
    return EditorFormat.format(editor)
  }
  return editor
}
