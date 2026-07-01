import type { EditorState } from '../State/State.ts'
import * as Assert from '../Assert/Assert.ts'

export const setSaveOnBlur = (editor: EditorState, enabled: boolean): EditorState => {
  Assert.boolean(enabled)
  if (editor.saveOnBlur === enabled) {
    return editor
  }
  return {
    ...editor,
    saveOnBlur: enabled,
  }
}
