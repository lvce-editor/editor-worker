import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.cursorInfos === newState.cursorInfos &&
    oldState.diagnostics === newState.diagnostics &&
    oldState.highlightedLine === newState.highlightedLine &&
    oldState.lineNumbers === newState.lineNumbers &&
    oldState.loadError === newState.loadError &&
    oldState.textInfos === newState.textInfos &&
    oldState.differences === newState.differences &&
    oldState.initial === newState.initial &&
    oldState.selectionInfos === newState.selectionInfos
  )
}
