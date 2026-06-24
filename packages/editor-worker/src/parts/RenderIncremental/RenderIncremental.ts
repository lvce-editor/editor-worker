import { ViewletCommand } from '@lvce-editor/constants'
import { type VirtualDomNode, diffTree } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../State/State.ts'
import { getEditorVirtualDom } from '../GetEditorVirtualDom/GetEditorVirtualDom.ts'
import * as RenderedDoms from '../RenderedDoms/RenderedDoms.ts'

export const getDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { initial, textInfos } = state
  if (initial && textInfos.length === 0) {
    return []
  }

  return getEditorVirtualDom(state)
}

export const renderIncremental = (oldState: EditorState, newState: EditorState): any => {
  const oldDom: readonly VirtualDomNode[] = oldState.initial ? getDom(oldState) : RenderedDoms.get(newState.uid) || getDom(oldState)
  const newDom: readonly VirtualDomNode[] = getDom(newState)
<<<<<<< Updated upstream
=======
  if (isFastScroll(oldState, newState)) {
    RenderedDoms.set(newState.uid, newDom)
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
>>>>>>> Stashed changes
  const patches = diffTree(oldDom, newDom)
  if (patches.length === 0) {
    return []
  }
  RenderedDoms.set(newState.uid, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
