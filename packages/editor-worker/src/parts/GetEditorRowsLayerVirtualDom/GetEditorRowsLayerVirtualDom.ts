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
  problemsHighlightedRow = -1,
  unnecessaryDiagnostics: readonly any[] = [],
  horizontalVisibleRanges: readonly {
    readonly end: number
    readonly rowIndex: number
    readonly segments?: readonly number[]
    readonly start: number
  }[] = [],
  lines: readonly string[] = [],
  tabSize = 2,
): readonly VirtualDomNode[] => {
  const rowsDom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(
    textInfos,
    differences,
    lineNumbers,
    highlightedLine,
    visibleLineIndices,
    endOfLineDecorations,
    visibleViewLineIndices,
    problemsHighlightedRow,
    unnecessaryDiagnostics,
    0,
    Infinity,
    1,
    tabSize,
    lines,
    500,
    horizontalVisibleRanges,
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
