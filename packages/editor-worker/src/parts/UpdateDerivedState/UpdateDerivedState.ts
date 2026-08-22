import type { EditorState } from '../State/State.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as EditorText from '../EditorText/EditorText.ts'
import { getEditorGutterDecorations } from '../GetEditorGutterDecorations/GetEditorGutterDecorations.ts'
import * as GetLightBulbRowIndex from '../GetLightBulbRowIndex/GetLightBulbRowIndex.ts'
import * as GetMinimapLines from '../GetMinimapLines/GetMinimapLines.ts'
import * as GetVisibleBracketMatches from '../GetVisibleBracketMatches/GetVisibleBracketMatches.ts'
import * as GetVisibleDiagnostics from '../GetVisibleDiagnostics/GetVisibleDiagnostics.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'

const shouldUpdateDiagnosticData = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.diagnostics !== newState.diagnostics ||
    ((newState.diagnostics?.length ?? 0) > 0 &&
      (oldState.minLineY !== newState.minLineY ||
        oldState.charWidth !== newState.charWidth ||
        oldState.fontFamily !== newState.fontFamily ||
        oldState.fontSize !== newState.fontSize ||
        oldState.fontWeight !== newState.fontWeight ||
        oldState.isMonospaceFont !== newState.isMonospaceFont ||
        oldState.letterSpacing !== newState.letterSpacing ||
        oldState.lines !== newState.lines ||
        oldState.rowHeight !== newState.rowHeight ||
        oldState.tabSize !== newState.tabSize ||
        oldState.width !== newState.width))
  )
}

const shouldUpdateSelectionData = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.selections !== newState.selections ||
    oldState.focused !== newState.focused ||
    oldState.minLineY !== newState.minLineY ||
    oldState.maxLineY !== newState.maxLineY ||
    oldState.foldingRanges !== newState.foldingRanges ||
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

const shouldUpdateBracketMatchData = (oldState: EditorState, newState: EditorState): boolean => {
  if (!('bracketMatchInfos' in newState)) {
    return false
  }
  return (
    oldState.selections !== newState.selections ||
    oldState.lines !== newState.lines ||
    oldState.minLineY !== newState.minLineY ||
    oldState.maxLineY !== newState.maxLineY ||
    oldState.visibleLineIndices !== newState.visibleLineIndices ||
    oldState.foldingRanges !== newState.foldingRanges ||
    oldState.differences !== newState.differences ||
    oldState.charWidth !== newState.charWidth ||
    oldState.fontFamily !== newState.fontFamily ||
    oldState.fontSize !== newState.fontSize ||
    oldState.fontWeight !== newState.fontWeight ||
    oldState.isMonospaceFont !== newState.isMonospaceFont ||
    oldState.letterSpacing !== newState.letterSpacing ||
    oldState.rowHeight !== newState.rowHeight ||
    oldState.tabSize !== newState.tabSize ||
    oldState.width !== newState.width
  )
}

const shouldUpdateLightBulb = (oldState: EditorState, newState: EditorState): boolean =>
  oldState.diagnostics !== newState.diagnostics ||
  oldState.languageId !== newState.languageId ||
  oldState.selections !== newState.selections ||
  oldState.uri !== newState.uri

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
    oldState.foldingRanges !== newState.foldingRanges ||
    oldState.debugEnabled !== newState.debugEnabled
  )
}

const shouldUpdateMinimapData = (oldState: EditorState, newState: EditorState): boolean => {
  return newState.minimapEnabled && (!oldState.minimapEnabled || oldState.lines !== newState.lines || oldState.tokenizerId !== newState.tokenizerId)
}

export const updateDerivedState = async (oldState: EditorState, newState: EditorState): Promise<EditorState> => {
  const nextState = oldState.lines !== newState.lines && 'foldingRanges' in newState ? EditorFolding.updateLayout(newState, []) : newState
  let finalState = nextState
  if (shouldUpdateVisibleTextData(oldState, nextState)) {
    const syncIncremental = SyncIncremental.getEnabled()
    const { differences, textInfos } = await EditorText.getVisible(nextState, syncIncremental)
    finalState = {
      ...nextState,
      differences,
      textInfos,
    }
  }

  if (!nextState.minimapEnabled && oldState.minimapEnabled) {
    finalState = {
      ...finalState,
      minimapLines: [],
      minimapRevision: finalState.minimapRevision + 1,
    }
  } else if (shouldUpdateMinimapData(oldState, nextState)) {
    const syncIncremental = SyncIncremental.getEnabled()
    const minimapLines = await GetMinimapLines.getMinimapLines(finalState, syncIncremental)
    finalState = {
      ...finalState,
      minimapLines,
      minimapRevision: finalState.minimapRevision + 1,
    }
  }

  if (shouldUpdateBracketMatchData(oldState, finalState)) {
    finalState = {
      ...finalState,
      bracketMatchInfos: await GetVisibleBracketMatches.getVisibleBracketMatches(finalState),
    }
  }

  if (shouldUpdateDiagnosticData(oldState, nextState)) {
    const visualDecorations = await GetVisibleDiagnostics.getVisibleDiagnostics(finalState, finalState.diagnostics ?? [])
    finalState = {
      ...finalState,
      visualDecorations,
    }
  }

  if (oldState.lines !== nextState.lines) {
    finalState = {
      ...finalState,
      lightBulbRowIndex: -1,
    }
  } else if (shouldUpdateLightBulb(oldState, nextState)) {
    finalState = {
      ...finalState,
      lightBulbRowIndex: await GetLightBulbRowIndex.getLightBulbRowIndex(finalState),
    }
  }

  if (oldState.lines !== nextState.lines || oldState.uri !== nextState.uri) {
    finalState = {
      ...finalState,
      gutterDecorations: await getEditorGutterDecorations(finalState),
    }
  }

  if (!shouldUpdateSelectionData(oldState, nextState)) {
    return finalState
  }

  const { cursorInfos, selectionInfos } = await EditorSelection.getVisible(finalState)
  return {
    ...finalState,
    cursorInfos,
    selectionInfos,
  }
}
