import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import * as DiffAdditionalFocus from '../DiffAdditionalFocus/DiffAdditionalFocus.ts'
import * as DiffCss from '../DiffCss/DiffCss.ts'
import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import { emptyIncrementalEdits } from '../EmptyIncrementalEdits/EmptyIncrementalEdits.ts'
import * as GetBracketMatchesVirtualDom from '../GetBracketMatchesVirtualDom/GetBracketMatchesVirtualDom.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import { getGutterInfos } from '../GetGutterInfos/GetGutterInfos.ts'
import { getPrimaryCursorRowIndex } from '../GetPrimaryCursorRowIndex/GetPrimaryCursorRowIndex.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as RenderAdditionalFocusContext from '../RenderAdditionalFocusContext/RenderAdditionalFocusContext.ts'
import { renderCss as renderCssCommand } from '../RenderCss/RenderCss.ts'
import { renderWidgets as renderWidgetsCommand } from '../RenderWidgets/RenderWidgets.ts'

const renderLines = {
  apply(oldState: EditorState, newState: EditorState) {
    const { incrementalEdits } = newState
    if (incrementalEdits !== emptyIncrementalEdits) {
      return [/* method */ 'setIncrementalEdits', /* incrementalEdits */ incrementalEdits]
    }
    const { differences, endOfLineDecorations, textInfos } = newState
    newState.differences = differences
    const { highlightedLine, visibleLineIndices } = newState
    const relativeLine = visibleLineIndices.indexOf(highlightedLine)
    const dom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences, true, relativeLine, visibleLineIndices, endOfLineDecorations)
    return [/* method */ 'setText', dom]
  },
  isEqual: (oldState: EditorState, newState: EditorState) =>
    oldState.lines === newState.lines &&
    oldState.foldingRanges === newState.foldingRanges &&
    oldState.tokenizerId === newState.tokenizerId &&
    oldState.minLineY === newState.minLineY &&
    oldState.decorations === newState.decorations &&
    oldState.embeds === newState.embeds &&
    oldState.endOfLineDecorations === newState.endOfLineDecorations &&
    oldState.deltaX === newState.deltaX &&
    oldState.width === newState.width &&
    oldState.highlightedLine === newState.highlightedLine &&
    oldState.debugEnabled === newState.debugEnabled,
}

const renderSelections = {
  apply: (oldState: any, newState: any) => {
    const { cursorInfos = [], selectionInfos = [] } = newState
    const cursorsDom = GetCursorsVirtualDom.getCursorsVirtualDom(cursorInfos)
    const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos)
    return [/* method */ 'setSelections', cursorsDom, selectionsDom]
  },
  isEqual: (oldState: any, newState: any) => oldState.cursorInfos === newState.cursorInfos && oldState.selectionInfos === newState.selectionInfos,
}

const renderCss = {
  apply: renderCssCommand,
  isEqual: DiffCss.isEqual,
}

const renderFocus = {
  apply: (oldState: EditorState, newState: EditorState) => [/* method */ 'setFocused', newState.focused],
  isEqual: DiffFocus.isEqual,
}

const renderFocusContext = {
  apply: (oldState: EditorState, newState: EditorState) => [ViewletCommand.SetFocusContext, newState.uid, newState.focus, 0, newState.uid, 'Editor'],
  isEqual: (oldState: EditorState, newState: EditorState) => oldState.focus === newState.focus,
}

const renderAdditionalFocusContext = {
  apply: RenderAdditionalFocusContext.renderAdditionalFocusContext,
  isEqual: DiffAdditionalFocus.isEqual,
}

const renderDecorations = {
  apply(oldState: EditorState, newState: EditorState) {
    const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(newState.visualDecorations || [])
    const bracketMatchesDom = GetBracketMatchesVirtualDom.getBracketMatchesVirtualDom(newState.bracketMatchInfos || [])
    const dom = [...diagnosticsDom, ...bracketMatchesDom]
    return ['setDecorationsDom', dom]
  },
  isEqual: (oldState: EditorState, newState: EditorState) =>
    oldState.visualDecorations === newState.visualDecorations && oldState.bracketMatchInfos === newState.bracketMatchInfos,
}

const renderGutterInfo = {
  apply(oldState: EditorState, newState: EditorState) {
    const {
      breakPoints,
      gutterDecorations,
      lightBulbRowIndex,
      lineNumbers,
      maxLineY,
      minLineY,
      primarySelectionIndex,
      selections,
      visibleLineIndices,
    } = newState
    if (!lineNumbers && breakPoints.length === 0 && lightBulbRowIndex === -1 && gutterDecorations.length === 0) {
      return ['renderGutter', []]
    }
    const gutterInfos = getGutterInfos(minLineY, maxLineY, breakPoints, lineNumbers, visibleLineIndices, lightBulbRowIndex, gutterDecorations)
    const primaryCursorRowIndex = getPrimaryCursorRowIndex(selections, primarySelectionIndex)
    const dom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom(gutterInfos, primaryCursorRowIndex + 1)
    return ['renderGutter', dom]
  },
  isEqual: (oldState: EditorState, newState: EditorState) =>
    oldState.breakPoints === newState.breakPoints &&
    oldState.gutterDecorations === newState.gutterDecorations &&
    oldState.lightBulbRowIndex === newState.lightBulbRowIndex &&
    oldState.foldingRanges === newState.foldingRanges &&
    oldState.lineNumbers === newState.lineNumbers &&
    oldState.minLineY === newState.minLineY &&
    oldState.maxLineY === newState.maxLineY &&
    getPrimaryCursorRowIndex(oldState.selections, oldState.primarySelectionIndex) ===
      getPrimaryCursorRowIndex(newState.selections, newState.primarySelectionIndex),
}

const renderWidgets = {
  apply: renderWidgetsCommand,
  isEqual: (oldState: any, newState: any) => oldState.widgets === newState.widgets && oldState.widgetRevision === newState.widgetRevision,
  multiple: true,
}

const render = [
  renderLines,
  renderSelections,
  renderCss,
  renderFocus,
  renderDecorations,
  renderGutterInfo,
  renderWidgets,
  renderFocusContext,
  renderAdditionalFocusContext,
]

export const renderEditor = async (id: number) => {
  const instance = Editors.get(id)
  if (!instance) {
    return []
  }
  const { newState, oldState } = instance
  const commands = []
  Editors.set(id, newState, newState)
  for (const item of render) {
    if (item.isEqual(oldState, newState)) {
      continue
    }
    const result = await item.apply(oldState, newState)
    // @ts-ignore
    if (item.multiple) {
      commands.push(...result)
    } else if (result.length > 0) {
      commands.push(result)
    }
  }
  return commands
}
