import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getScrollBarVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames('ScrollBar', 'ScrollBarVertical'),
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onPointerDown: DomEventListenerFunctions.HandleScrollBarVerticalPointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames('ScrollBarThumb', 'ScrollBarThumbVertical'),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames('ScrollBar', 'ScrollBarHorizontal'),
      onPointerDown: DomEventListenerFunctions.HandleScrollBarHorizontalPointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames('ScrollBarThumb', 'ScrollBarThumbHorizontal'),
      type: VirtualDomElements.Div,
    },
  ]
}
