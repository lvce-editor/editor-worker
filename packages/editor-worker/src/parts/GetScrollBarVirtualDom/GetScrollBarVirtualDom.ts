import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const verticalScrollBarNode: VirtualDomNode = {
  childCount: 1,
  className: MergeClassNames.mergeClassNames('ScrollBar', 'ScrollBarVertical'),
  onContextMenu: DomEventListenerFunctions.HandleContextMenu,
  onPointerDown: DomEventListenerFunctions.HandleScrollBarVerticalPointerDown,
  type: VirtualDomElements.Div,
}

const verticalScrollBarThumbNode: VirtualDomNode = {
  childCount: 0,
  className: MergeClassNames.mergeClassNames('ScrollBarThumb', 'ScrollBarThumbVertical'),
  type: VirtualDomElements.Div,
}

const horizontalScrollBarNode: VirtualDomNode = {
  childCount: 1,
  className: MergeClassNames.mergeClassNames('ScrollBar', 'ScrollBarHorizontal'),
  onPointerDown: DomEventListenerFunctions.HandleScrollBarHorizontalPointerDown,
  type: VirtualDomElements.Div,
}

const horizontalScrollBarThumbNode: VirtualDomNode = {
  childCount: 0,
  className: MergeClassNames.mergeClassNames('ScrollBarThumb', 'ScrollBarThumbHorizontal'),
  type: VirtualDomElements.Div,
}

export const getScrollBarVirtualDom = (): readonly VirtualDomNode[] => {
  return [verticalScrollBarNode, verticalScrollBarThumbNode, horizontalScrollBarNode, horizontalScrollBarThumbNode]
}
