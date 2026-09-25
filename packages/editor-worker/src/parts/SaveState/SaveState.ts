import type { EditorState } from '../State/State.ts'

export const saveState = (state: EditorState, savedState: unknown): any => {
  const { largeFile, lines, redoStack, undoStack } = state
  return {
    ...(largeFile && { largeFile: true }),
    ...((redoStack.length > 0 || undoStack.length > 0) && { lines, redoStack, undoStack }),
  }
}
