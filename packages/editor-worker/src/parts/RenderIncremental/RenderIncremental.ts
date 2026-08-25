import { ViewletCommand } from '@lvce-editor/constants'
import { type VirtualDomNode, diffTree } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../State/State.ts'
import { getEditorVirtualDom } from '../GetEditorVirtualDom/GetEditorVirtualDom.ts'
import { getScrollBarDiagnostics } from '../GetScrollBarDiagnostics/GetScrollBarDiagnostics.ts'
import * as RenderedDoms from '../RenderedDoms/RenderedDoms.ts'

const getDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { diagnostics = [], initial, textInfos, visualDecorations = [] } = state
  if (initial && textInfos.length === 0) {
    return []
  }

  return getEditorVirtualDom({
    ...state,
    diagnostics: visualDecorations,
    scrollBarDiagnostics: getScrollBarDiagnostics(state, diagnostics),
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
  const oldDom: readonly VirtualDomNode[] =
    oldState.initial || !mergeConflictsEqual(oldState, newState) ? getDom(oldState) : RenderedDoms.get(newState.uid) || getDom(oldState)
  const newDom: readonly VirtualDomNode[] = getDom(newState)
  const patches = diffTree(oldDom, newDom)
  if (patches.length === 0) {
    return []
  }
  RenderedDoms.set(newState.uid, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
