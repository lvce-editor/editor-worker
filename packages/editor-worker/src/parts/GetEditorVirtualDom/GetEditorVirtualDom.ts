import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorContentVirtualDom from '../GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as GetEditorGutterLayerVirtualDom from '../GetEditorGutterLayerVirtualDom/GetEditorGutterLayerVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

interface EditorVirtualDomOptions {
  readonly cursorInfos?: readonly any[]
  readonly deltaY?: number
  readonly diagnostics?: readonly any[]
  readonly differences: readonly number[]
  readonly finalDeltaY?: number
  readonly gutterInfos?: readonly any[]
  readonly height?: number
  readonly highlightedLine?: number
  readonly lineNumbers?: boolean
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly selectionInfos?: readonly any[]
  readonly selections?: any
  readonly textInfos: readonly any[]
}

export const getEditorVirtualDom = ({
  cursorInfos = [],
  diagnostics = [],
  differences,
  gutterInfos = [],
  highlightedLine = -1,
  lineNumbers = true,
  scrollBarDiagnostics = [],
  selectionInfos = [],
  textInfos,
}: EditorVirtualDomOptions): readonly VirtualDomNode[] => {
  const gutterDom = lineNumbers ? GetEditorGutterLayerVirtualDom.getEditorGutterVirtualDom(gutterInfos) : []
  return [
    {
      childCount: lineNumbers ? 2 : 1,
      className: 'Viewlet Editor',
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      role: 'code',
      type: VirtualDomElements.Div,
    },
    ...gutterDom,
    ...GetEditorContentVirtualDom.getEditorContentVirtualDom({
      cursorInfos,
      diagnostics,
      differences,
      highlightedLine,
      lineNumbers,
      scrollBarDiagnostics,
      selectionInfos,
      textInfos,
    }),
  ]
}
