import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  if (oldState.focus !== newState.focus) {
    return false
  }
  if (!newState.focused) {
    return true
  }
  if (!oldState.isSelecting && newState.isSelecting) {
    return false
  }
  return oldState.focused === newState.focused
}
