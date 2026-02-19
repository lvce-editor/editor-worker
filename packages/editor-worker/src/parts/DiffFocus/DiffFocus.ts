import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  return oldState.focused === newState.focused && oldState.focus === newState.focus
}
