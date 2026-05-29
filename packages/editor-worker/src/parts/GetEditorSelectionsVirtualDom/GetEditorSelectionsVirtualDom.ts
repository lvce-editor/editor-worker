import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorSelectionsVirtualDom = (selectionInfos: readonly any[]): readonly VirtualDomNode[] => {
  const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos)
  return [
    {
      childCount: selectionInfos.length / 4,
      className: 'Selections',
      type: VirtualDomElements.Div,
    },
    ...selectionsDom,
  ]
}
