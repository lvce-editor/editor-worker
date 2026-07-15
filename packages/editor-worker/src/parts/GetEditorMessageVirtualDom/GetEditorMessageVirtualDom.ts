import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getEditorMessageVirtualDom = (message: string, x = 0, y = 0): readonly VirtualDomNode[] => {
  const dom: readonly VirtualDomNode[] = [
    {
      childCount: 2,
      className: 'Viewlet EditorMessage EditorOverlayMessage',
      style: `position:fixed;left:${x}px;top:${y}px;`,
      tabIndex: -1,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorMessageText',
      type: VirtualDomElements.Div,
    },
    text(message),
    {
      childCount: 0,
      className: 'EditorMessageTriangle',
      type: VirtualDomElements.Div,
    },
  ]
  return dom
}
