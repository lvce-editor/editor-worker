import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorRowsVirtualDom = (
  textInfos: readonly any[],
  differences: readonly number[],
  lineNumbers = true,
  highlightedLine = -1,
  visibleLineIndices: readonly number[] = [],
  endOfLineDecorations: readonly { readonly rowIndex: number; readonly text: string }[] = [],
  visibleViewLineIndices: readonly number[] = [],
): readonly VirtualDomNode[] => {
  const rowsDom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(
    textInfos,
    differences,
    lineNumbers,
    highlightedLine,
    visibleLineIndices,
    endOfLineDecorations,
    visibleViewLineIndices,
  )
  return [
    {
      childCount: visibleViewLineIndices.length || textInfos.length,
      className: 'EditorRows',
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      type: VirtualDomElements.Div,
    },
    ...rowsDom,
  ]
}
