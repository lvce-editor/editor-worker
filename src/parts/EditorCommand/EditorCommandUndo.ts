import * as Editor from '../Editor/Editor.ts'
import * as InverseChange from '../InverseChange/InverseChange.ts'

export const undo = (state: any) => {
  const { undoStack } = state
  if (undoStack.length === 0) {
    return state
  }
  // TODO avoid side effect?
  const last = undoStack.pop()
  const inverseChanges = last.map(InverseChange.inverseChange)
  return Editor.scheduleDocumentAndCursorsSelectionIsUndo(state, inverseChanges)
}
