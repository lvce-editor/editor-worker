import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../State/State.ts'

export const renderIncremental = (oldState: EditorState, newState: EditorState): any => {
  const oldDom: readonly VirtualDomNode[] = []
  const newDom: readonly VirtualDomNode[] = []
  const patches = diffTree(oldDom, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
