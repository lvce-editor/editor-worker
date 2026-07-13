import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorContentVirtualDom from '../GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as GetEditorGutterLayerVirtualDom from '../GetEditorGutterLayerVirtualDom/GetEditorGutterLayerVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

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
  readonly loadError?: string
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly selectionInfos?: readonly any[]
  readonly selections?: any
  readonly textInfos: readonly any[]
  readonly uid: number
}

export const getEditorVirtualDom = ({
  cursorInfos = [],
  diagnostics = [],
  differences,
  gutterInfos = [],
  highlightedLine = -1,
  lineNumbers = true,
  loadError = '',
  scrollBarDiagnostics = [],
  selectionInfos = [],
  textInfos,
  uid,
}: EditorVirtualDomOptions): readonly VirtualDomNode[] => {
  if (loadError) {
    return [
      {
        childCount: 2,
        className: 'Viewlet TextEditorError',
        'data-uid': uid,
        role: 'code',
        type: VirtualDomElements.Div,
      },
      {
        childCount: 0,
        className: 'EditorTextIcon EditorTextIconError MaskIcon MaskIconError',
        type: VirtualDomElements.Div,
      },
      {
        childCount: 1,
        className: 'TextEditorErrorMessage',
        type: VirtualDomElements.Div,
      },
      text(loadError),
    ]
  }
  const gutterDom = lineNumbers ? GetEditorGutterLayerVirtualDom.getEditorGutterVirtualDom(gutterInfos) : []
  return [
    {
      childCount: lineNumbers ? 2 : 1,
      className: 'Viewlet Editor',
      'data-uid': uid,
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
