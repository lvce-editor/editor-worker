import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorInputVirtualDom from '../GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'
import * as GetEditorLayersVirtualDom from '../GetEditorLayersVirtualDom/GetEditorLayersVirtualDom.ts'
import * as GetEditorScrollBarDiagnosticsVirtualDom from '../GetEditorScrollBarDiagnosticsVirtualDom/GetEditorScrollBarDiagnosticsVirtualDom.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const editorContentNode: VirtualDomNode = {
  childCount: 5,
  className: 'EditorContent',
  onKeyUp: DomEventListenerFunctions.HandleKeyUp,
  onMouseMove: DomEventListenerFunctions.HandleMouseMove,
  onWheel: DomEventListenerFunctions.HandleWheel,
  type: VirtualDomElements.Div,
}

interface EditorContentVirtualDomOptions {
  readonly bracketMatchInfos?: readonly any[]
  readonly breadcrumbsEnabled?: boolean
  readonly cursorInfos?: readonly any[]
  readonly deltaY?: number
  readonly diagnostics?: readonly any[]
  readonly differences: readonly number[]
  readonly endOfLineDecorations?: readonly { readonly rowIndex: number; readonly text: string }[]
  readonly finalDeltaY?: number
  readonly focused?: boolean
  readonly height?: number
  readonly highlightedLine?: number
  readonly horizontalVisibleRanges?: readonly {
    readonly end: number
    readonly rowIndex: number
    readonly segments?: readonly number[]
    readonly start: number
  }[]
  readonly lineNumbers?: boolean
  readonly lines?: readonly string[]
  readonly problemsHighlightedRow?: number
  readonly roundedSelection?: boolean
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly scrollBarWidth?: number
  readonly selectionInfos?: readonly any[]
  readonly tabSize?: number
  readonly textInfos: readonly any[]
  readonly unnecessaryDiagnostics?: readonly any[]
  readonly visibleLineIndices?: readonly number[]
  readonly visibleViewLineIndices?: readonly number[]
}

export const getEditorContentVirtualDom = ({
  bracketMatchInfos = [],
  breadcrumbsEnabled = false,
  cursorInfos = [],
  diagnostics = [],
  differences,
  endOfLineDecorations = [],
  focused = true,
  highlightedLine = -1,
  horizontalVisibleRanges = [],
  lineNumbers = true,
  lines = [],
  problemsHighlightedRow = -1,
  roundedSelection = false,
  scrollBarDiagnostics = [],
  scrollBarHeight = 0,
  scrollBarWidth = 0,
  selectionInfos = [],
  tabSize = 2,
  textInfos,
  unnecessaryDiagnostics = [],
  visibleLineIndices = [],
  visibleViewLineIndices = [],
}: EditorContentVirtualDomOptions): readonly VirtualDomNode[] => {
  return [
    {
      ...editorContentNode,
      className: breadcrumbsEnabled ? 'EditorContent EditorBreadcrumbsOffset' : 'EditorContent',
    },
    ...GetEditorInputVirtualDom.getEditorInputVirtualDom(),
    ...GetEditorLayersVirtualDom.getEditorLayersVirtualDom(
      selectionInfos,
      textInfos,
      differences,
      lineNumbers,
      highlightedLine,
      cursorInfos,
      diagnostics,
      visibleLineIndices,
      endOfLineDecorations,
      bracketMatchInfos,
      focused,
      visibleViewLineIndices,
      problemsHighlightedRow,
      roundedSelection,
      unnecessaryDiagnostics,
      horizontalVisibleRanges,
      lines,
      tabSize,
    ),
    ...GetEditorScrollBarDiagnosticsVirtualDom.getEditorScrollBarDiagnosticsVirtualDom(scrollBarDiagnostics),
    ...GetScrollBarVirtualDom.getScrollBarVirtualDom(scrollBarHeight, scrollBarWidth),
  ]
}
