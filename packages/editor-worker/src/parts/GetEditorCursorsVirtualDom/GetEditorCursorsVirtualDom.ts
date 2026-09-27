import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorCursorsVirtualDom = (cursorInfos: readonly any[], focused = true): readonly VirtualDomNode[] => {
  const cursorsDom = focused ? GetCursorsVirtualDom.getCursorsVirtualDom([...cursorInfos]) : []
  return [
    {
      childCount: focused ? cursorInfos.length : 0,
      className: 'LayerCursor',
      type: VirtualDomElements.Div,
    },
    ...cursorsDom,
  ]
}
