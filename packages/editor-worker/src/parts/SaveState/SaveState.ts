import type { EditorState } from '../State/State.ts'

export const saveState = (state: EditorState, hotReload: unknown): any => {
  const { deltaY, endOfLine, lines, modified, redoStack, selections, undoStack } = state
  if (hotReload === true) {
    return {
      deltaY,
      endOfLine,
      hotReload: true,
      lines,
      modified,
      redoStack,
      selections: [...state.selections],
      undoStack,
    }
  }
  return {
    lines,
    redoStack,
    undoStack,
  }
}
