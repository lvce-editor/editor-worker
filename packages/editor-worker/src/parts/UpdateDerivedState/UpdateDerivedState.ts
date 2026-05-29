import type { EditorState } from '../State/State.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

const shouldUpdateSelectionData = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.selections !== newState.selections ||
    oldState.focused !== newState.focused ||
    oldState.minLineY !== newState.minLineY ||
    oldState.maxLineY !== newState.maxLineY ||
    oldState.differences !== newState.differences ||
    oldState.charWidth !== newState.charWidth ||
    oldState.cursorWidth !== newState.cursorWidth ||
    oldState.fontFamily !== newState.fontFamily ||
    oldState.fontSize !== newState.fontSize ||
    oldState.fontWeight !== newState.fontWeight ||
    oldState.isMonospaceFont !== newState.isMonospaceFont ||
    oldState.letterSpacing !== newState.letterSpacing ||
    oldState.lines !== newState.lines ||
    oldState.rowHeight !== newState.rowHeight ||
    oldState.tabSize !== newState.tabSize ||
    oldState.width !== newState.width
  )
}

export const updateDerivedState = async (oldState: EditorState, newState: EditorState): Promise<EditorState> => {
  if (!shouldUpdateSelectionData(oldState, newState)) {
    return newState
  }
  const { cursorInfos, selectionInfos } = await EditorSelection.getVisible(newState)
  return {
    ...newState,
    cursorInfos,
    selectionInfos,
  }
}
