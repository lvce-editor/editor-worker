import type { EditorState } from '../State/State.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'

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

const shouldUpdateVisibleTextData = (oldState: EditorState, newState: EditorState): boolean => {
  if (oldState.textInfos !== newState.textInfos || oldState.differences !== newState.differences) {
    return false
  }

  return (
    oldState.lines !== newState.lines ||
    oldState.tokenizerId !== newState.tokenizerId ||
    oldState.minLineY !== newState.minLineY ||
    oldState.maxLineY !== newState.maxLineY ||
    oldState.decorations !== newState.decorations ||
    oldState.embeds !== newState.embeds ||
    oldState.deltaX !== newState.deltaX ||
    oldState.width !== newState.width ||
    oldState.highlightedLine !== newState.highlightedLine ||
    oldState.debugEnabled !== newState.debugEnabled
  )
}

export const updateDerivedState = async (oldState: EditorState, newState: EditorState): Promise<EditorState> => {
  let finalState = newState
  if (shouldUpdateVisibleTextData(oldState, newState)) {
    const syncIncremental = SyncIncremental.getEnabled()
    const { differences, textInfos } = await EditorText.getVisible(newState, syncIncremental)
    finalState = {
      ...newState,
      differences,
      textInfos,
    }
  }

  if (!shouldUpdateSelectionData(oldState, newState)) {
    return finalState
  }

  const { cursorInfos, selectionInfos } = await EditorSelection.getVisible(finalState)
  return {
    ...finalState,
    cursorInfos,
    selectionInfos,
  }
}
