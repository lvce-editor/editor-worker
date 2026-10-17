import { ViewletCommand } from '@lvce-editor/constants'
import { type VirtualDomNode, diffTree } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../State/State.ts'
import { getEditorVirtualDom } from '../GetEditorVirtualDom/GetEditorVirtualDom.ts'
import { getHorizontalScrollDimensions } from '../GetHorizontalScrollDimensions/GetHorizontalScrollDimensions.ts'
import { getScrollBarDiagnostics } from '../GetScrollBarDiagnostics/GetScrollBarDiagnostics.ts'
import * as RenderedDoms from '../RenderedDoms/RenderedDoms.ts'
import * as RenderPlainTextAppend from '../RenderPlainTextAppend/RenderPlainTextAppend.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

const getDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { diagnostics = [], initial, longestLineWidth, minimumSliderSize, textInfos, visualDecorations = [] } = state
  if (initial && textInfos.length === 0) {
    return []
  }

  const { width } = getHorizontalScrollDimensions(state)
  return getEditorVirtualDom({
    ...state,
    diagnostics: visualDecorations,
    scrollBarDiagnostics: getScrollBarDiagnostics(state, diagnostics),
    scrollBarWidth: ScrollBarFunctions.getScrollBarSize(width, longestLineWidth, minimumSliderSize),
    unnecessaryDiagnostics: diagnostics,
  })
}

const mergeConflictsEqual = (oldState: EditorState, newState: EditorState): boolean => {
  const oldConflicts = oldState.mergeConflicts || []
  const newConflicts = newState.mergeConflicts || []
  return (
    oldConflicts.length === newConflicts.length &&
    oldConflicts.every((conflict, index) => {
      const other = newConflicts[index]
      return conflict.startRowIndex === other.startRowIndex && conflict.endRowIndex === other.endRowIndex
    })
  )
}

export const renderIncremental = (oldState: EditorState, newState: EditorState): any => {
  const renderedDom = RenderedDoms.get(newState.uid)
  const textAppendPaths = RenderedDoms.getTextAppendPaths(newState.uid)
  if (renderedDom && textAppendPaths && RenderPlainTextAppend.canRenderPlainTextAppend(oldState, newState)) {
    const newDom = RenderPlainTextAppend.updateTextAppendDom(renderedDom, newState, textAppendPaths)
    RenderedDoms.set(newState.uid, newDom, textAppendPaths)
    const patches = RenderPlainTextAppend.getTextAppendPatches(newState, textAppendPaths)
    return [ViewletCommand.SetPatches, newState.uid, patches]
  }

  const oldDom: readonly VirtualDomNode[] =
    oldState.initial || !mergeConflictsEqual(oldState, newState) ? getDom(oldState) : RenderedDoms.get(newState.uid) || getDom(oldState)
  const newDom: readonly VirtualDomNode[] = getDom(newState)
  const patches = diffTree(oldDom, newDom)
  const newTextAppendPaths =
    newState.languageId === 'plaintext' && newState.lines.length === 1 ? RenderPlainTextAppend.getTextAppendPaths(newDom) : undefined
  RenderedDoms.set(newState.uid, newDom, newTextAppendPaths)
  if (patches.length === 0) {
    return []
  }
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
