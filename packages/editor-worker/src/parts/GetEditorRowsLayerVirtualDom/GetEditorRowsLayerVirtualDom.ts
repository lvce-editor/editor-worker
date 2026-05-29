import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorRowsVirtualDom = (
  textInfos: readonly any[],
  differences: readonly number[],
  lineNumbers = true,
  highlightedLine = -1,
): readonly VirtualDomNode[] => {
  const rowsDom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences, lineNumbers, highlightedLine)
  return [
    {
      childCount: textInfos.length,
      className: 'EditorRows',
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      onWheel: DomEventListenerFunctions.HandleWheel,
      type: VirtualDomElements.Div,
    },
    ...rowsDom,
  ]
}
