import type { State } from '../State/State.ts'

export const handleBlur = (editor: State): State => {
  if (!editor.focused) {
    return editor
  }
  const newEditor = {
    ...editor,
    focused: false,
  }
  return newEditor
}
