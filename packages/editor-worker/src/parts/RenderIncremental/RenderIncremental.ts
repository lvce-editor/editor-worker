import { ViewletCommand } from '@lvce-editor/constants'
import { type VirtualDomNode, diffTree } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../State/State.ts'
import { getEditorVirtualDom } from '../GetEditorVirtualDom/GetEditorVirtualDom.ts'

const getDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { initial, textInfos } = state
  if (initial && textInfos.length === 0) {
    return []
  }

  return getEditorVirtualDom(state)
}

const isFastScroll = (oldState: EditorState, newState: EditorState): boolean => {
  return Math.abs(newState.minLineY - oldState.minLineY) > 1
}

export const renderIncremental = (oldState: EditorState, newState: EditorState): any => {
  const oldDom: readonly VirtualDomNode[] = getDom(oldState)
  const newDom: readonly VirtualDomNode[] = getDom(newState)
  if (isFastScroll(oldState, newState)) {
    return [
      ViewletCommand.SetPatches,
      newState.uid,
      [
        {
          nodes: newDom,
          type: 6,
        },
      ],
    ]
  }
  const patches = diffTree(oldDom, newDom)
  if (patches.length === 0) {
    return []
  }
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
