import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getScrollBarVirtualDom = (
  deltaY: number,
  finalDeltaY: number,
  height: number,
  scrollBarHeight: number,
): readonly VirtualDomNode[] => {
  const scrollBarY = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  return [
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarVertical',
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onPointerDown: DomEventListenerFunctions.HandleScrollBarVerticalPointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbVertical',
      style: `height:${scrollBarHeight}px;`,
      translate: `0 ${scrollBarY}px`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarHorizontal',
      onPointerDown: DomEventListenerFunctions.HandleScrollBarHorizontalPointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbHorizontal',
      type: VirtualDomElements.Div,
    },
  ]
}
