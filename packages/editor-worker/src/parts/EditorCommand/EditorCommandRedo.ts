import * as Editor from '../Editor/Editor.ts'

export const redo = (state: any) => {
  const { redoStack = [] } = state
  if (redoStack.length === 0) {
    return state
  }
  const last = redoStack.at(-1)
  const newState = {
    ...state,
    redoStack: redoStack.slice(0, -1),
    undoStack: [...state.undoStack, last],
  }
  return Editor.scheduleDocumentAndCursorsSelectionIsUndo(newState, last)
}
