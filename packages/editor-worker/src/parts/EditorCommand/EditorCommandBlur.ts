import type { EditorState } from '../State/State.ts'
import * as Preferences from '../Preferences/Preferences.ts'
import * as EditorCommandSave from './EditorCommandSave.ts'

export const handleBlur = async (editor: EditorState): Promise<EditorState> => {
  if (!editor.focused) {
    return editor
  }
  const newEditor = {
    ...editor,
    focused: false,
  }
  if (!editor.modified) {
    return newEditor
  }
  const autoSave = await Preferences.get('files.autoSave')
  if (autoSave === 'off') {
    return newEditor
  }
  return EditorCommandSave.save(newEditor)
}
