import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorInputVirtualDom from '../GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'
import * as GetEditorLayersVirtualDom from '../GetEditorLayersVirtualDom/GetEditorLayersVirtualDom.ts'
import * as GetEditorScrollBarDiagnosticsVirtualDom from '../GetEditorScrollBarDiagnosticsVirtualDom/GetEditorScrollBarDiagnosticsVirtualDom.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

interface EditorContentVirtualDomOptions {
  readonly cursorInfos?: readonly any[]
  readonly deltaY?: number
  readonly diagnostics?: readonly any[]
  readonly differences: readonly number[]
  readonly finalDeltaY?: number
  readonly height?: number
  readonly highlightedLine?: number
  readonly lineNumbers?: boolean
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly selectionInfos?: readonly any[]
  readonly textInfos: readonly any[]
}

export const getEditorContentVirtualDom = ({
  cursorInfos = [],
  diagnostics = [],
  differences,
  highlightedLine = -1,
  lineNumbers = true,
  scrollBarDiagnostics = [],
  selectionInfos = [],
  textInfos,
}: EditorContentVirtualDomOptions): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 5,
      className: 'EditorContent',
      onKeyUp: DomEventListenerFunctions.HandleKeyUp,
      onMouseMove: DomEventListenerFunctions.HandleMouseMove,
      type: VirtualDomElements.Div,
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
    ),
    ...GetEditorScrollBarDiagnosticsVirtualDom.getEditorScrollBarDiagnosticsVirtualDom(scrollBarDiagnostics),
    ...GetScrollBarVirtualDom.getScrollBarVirtualDom(),
  ]
}
