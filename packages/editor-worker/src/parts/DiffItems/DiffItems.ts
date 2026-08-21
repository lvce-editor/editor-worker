import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.breadcrumbsEnabled === newState.breadcrumbsEnabled &&
    oldState.breakPoints === newState.breakPoints &&
    oldState.bracketMatchInfos === newState.bracketMatchInfos &&
    oldState.cursorInfos === newState.cursorInfos &&
    oldState.diagnostics === newState.diagnostics &&
    oldState.documentSymbols === newState.documentSymbols &&
    oldState.endOfLineDecorations === newState.endOfLineDecorations &&
    oldState.highlightedLine === newState.highlightedLine &&
    oldState.lineNumbers === newState.lineNumbers &&
    oldState.loadError === newState.loadError &&
    oldState.textInfos === newState.textInfos &&
    oldState.differences === newState.differences &&
    oldState.initial === newState.initial &&
    oldState.selectionInfos === newState.selectionInfos &&
    oldState.selections === newState.selections &&
    oldState.workspaceUri === newState.workspaceUri
  )
}
