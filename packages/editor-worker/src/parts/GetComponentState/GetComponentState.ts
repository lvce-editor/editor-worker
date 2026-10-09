import * as EditorStates from '../EditorStates/EditorStates.ts'

export const getComponentState = (uid: number): Record<string, unknown> => {
  const { newState } = EditorStates.get(uid)
  return {
    ...newState,
    cursorUndoStack: newState.cursorUndoStack?.map((selection) => [...selection]),
    selections: [...newState.selections],
  }
}
