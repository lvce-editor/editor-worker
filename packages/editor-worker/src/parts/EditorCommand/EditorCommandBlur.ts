import type { EditorState } from '../State/State.ts'

export const handleBlur = (editor: EditorState): EditorState => {
  if (!editor.focused) {
    return editor
  }
  const newEditor = {
    ...editor,
    focused: false,
  }
  return newEditor
}
