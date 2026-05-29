import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorContentVirtualDom from '../GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as GetEditorGutterLayerVirtualDom from '../GetEditorGutterLayerVirtualDom/GetEditorGutterLayerVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

interface EditorVirtualDomOptions {
  readonly cursorInfos?: readonly any[]
  readonly diagnostics?: readonly any[]
  readonly differences: readonly number[]
  readonly gutterInfos?: readonly any[]
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
  scrollBarHeight = 0,
  selectionInfos = [],
  textInfos,
}: EditorVirtualDomOptions): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'Viewlet Editor',
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onWheel: DomEventListenerFunctions.HandleWheel,
      role: 'code',
      type: VirtualDomElements.Div,
    },
    ...GetEditorGutterLayerVirtualDom.getEditorGutterVirtualDom(gutterInfos),
    ...GetEditorContentVirtualDom.getEditorContentVirtualDom({
      cursorInfos,
      diagnostics,
      differences,
      highlightedLine,
      lineNumbers,
      scrollBarDiagnostics,
      scrollBarHeight,
      selectionInfos,
      textInfos,
    }),
  ]
}
