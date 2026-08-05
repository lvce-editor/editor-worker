import type { EditorState } from '../State/State.ts'

export const saveState = (state: EditorState, savedState: unknown): any => {
  const { lines, redoStack, undoStack } = state
  return {
    lines,
    redoStack,
    undoStack,
  }
}
