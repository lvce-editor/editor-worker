import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorCursorsVirtualDom = (cursorInfos: readonly any[]): readonly VirtualDomNode[] => {
  const cursorsDom = GetCursorsVirtualDom.getCursorsVirtualDom([...cursorInfos])
  return [
    {
      childCount: cursorInfos.length,
      className: 'LayerCursor',
      type: VirtualDomElements.Div,
    },
    ...cursorsDom,
  ]
}
