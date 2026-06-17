import * as Editor from '../Editor/Editor.ts'
import * as InverseChange from '../InverseChange/InverseChange.ts'

export const undo = (state: any) => {
  const { undoStack } = state
  if (undoStack.length === 0) {
    return state
  }
  const last = undoStack.at(-1)
  const inverseChanges = last.map(InverseChange.inverseChange)
  const newState = {
    ...state,
    redoStack: [...(state.redoStack || []), last],
    undoStack: undoStack.slice(0, -1),
  }
  return Editor.scheduleDocumentAndCursorsSelectionIsUndo(newState, inverseChanges)
}
