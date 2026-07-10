import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  if (!newState.focused) {
    return true
  }
  if (!oldState.isSelecting && newState.isSelecting) {
    return false
  }
  return oldState.focused === newState.focused && oldState.focus === newState.focus
}
