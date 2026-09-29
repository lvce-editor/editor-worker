import type { EditorState } from '../State/State.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.breadcrumbFileIcon === newState.breadcrumbFileIcon &&
    oldState.breadcrumbsEnabled === newState.breadcrumbsEnabled &&
    oldState.breakPoints === newState.breakPoints &&
    oldState.bracketMatchInfos === newState.bracketMatchInfos &&
    oldState.cursorInfos === newState.cursorInfos &&
    oldState.diagnostics === newState.diagnostics &&
    oldState.documentSymbols === newState.documentSymbols &&
    oldState.endOfLineDecorations === newState.endOfLineDecorations &&
    oldState.focused === newState.focused &&
    oldState.gutterDecorations === newState.gutterDecorations &&
    oldState.highlightActiveLineNumber === newState.highlightActiveLineNumber &&
    oldState.highlightedLine === newState.highlightedLine &&
    oldState.problemsHighlightedRow === newState.problemsHighlightedRow &&
    oldState.lineNumbers === newState.lineNumbers &&
    oldState.loadError === newState.loadError &&
    oldState.textInfos === newState.textInfos &&
    oldState.visibleViewLineIndices === newState.visibleViewLineIndices &&
    oldState.differences === newState.differences &&
    oldState.initial === newState.initial &&
    oldState.scrollBarHeight > 0 === newState.scrollBarHeight > 0 &&
    ScrollBarFunctions.getScrollBarSize(oldState.width, oldState.longestLineWidth, oldState.minimumSliderSize) > 0 ===
      ScrollBarFunctions.getScrollBarSize(newState.width, newState.longestLineWidth, newState.minimumSliderSize) > 0 &&
    oldState.selectionInfos === newState.selectionInfos &&
    oldState.selections === newState.selections &&
    oldState.workspaceUri === newState.workspaceUri
  )
}
