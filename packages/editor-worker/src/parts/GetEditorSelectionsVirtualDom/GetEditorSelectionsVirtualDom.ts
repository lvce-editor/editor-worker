import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorSelectionsVirtualDom = (selectionInfos: readonly any[], focused = true, roundedSelection = false): readonly VirtualDomNode[] => {
  const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos, focused, roundedSelection)
  return [
    {
      childCount: selectionInfos.length / 4,
      className: 'Selections',
      type: VirtualDomElements.Div,
    },
    ...selectionsDom,
  ]
}
