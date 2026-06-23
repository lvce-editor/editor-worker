import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  if (!newState.focused) {
    return true
  }
  return oldState.focused === newState.focused && oldState.focus === newState.focus
}
