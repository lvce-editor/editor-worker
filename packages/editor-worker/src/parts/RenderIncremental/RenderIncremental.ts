import { type VirtualDomNode, diffTree } from '@lvce-editor/virtual-dom-worker'
import { ViewletCommand } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import { getEditorVirtualDom } from '../GetEditorVirtualDom/GetEditorVirtualDom.ts'

const getDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { initial, textInfos } = state
  if (initial && textInfos.length === 0) {
    return []
  }

  return getEditorVirtualDom(state)
}

export const renderIncremental = (oldState: EditorState, newState: EditorState): any => {
  const oldDom: readonly VirtualDomNode[] = getDom(oldState)
  const newDom: readonly VirtualDomNode[] = getDom(newState)
  const patches = diffTree(oldDom, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
