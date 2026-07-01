import type { EditorState } from '../State/State.ts'
import * as Save from './EditorCommandSave.ts'

export const handleBlur = async (editor: EditorState): Promise<EditorState> => {
  if (!editor.focused) {
    return editor
  }
  const newEditor = {
    ...editor,
    focused: false,
  }
  if (newEditor.saveOnBlur !== false && newEditor.modified) {
    return Save.save(newEditor)
  }
  return newEditor
}
