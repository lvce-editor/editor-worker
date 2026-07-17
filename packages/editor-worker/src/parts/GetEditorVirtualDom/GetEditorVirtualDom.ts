import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorContentVirtualDom from '../GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as GetEditorGutterLayerVirtualDom from '../GetEditorGutterLayerVirtualDom/GetEditorGutterLayerVirtualDom.ts'
import { getGutterInfos } from '../GetGutterInfos/GetGutterInfos.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

interface EditorVirtualDomOptions {
  readonly breakPoints?: readonly number[]
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
  readonly maxLineY?: number
  readonly minLineY?: number
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly selectionInfos?: readonly any[]
  readonly selections?: any
  readonly textInfos: readonly any[]
  readonly uid: number
}

export const getEditorVirtualDom = ({
  breakPoints = [],
  cursorInfos = [],
  diagnostics = [],
  differences,
  gutterInfos = [],
  highlightedLine = -1,
  lineNumbers = true,
  loadError = '',
  maxLineY = 0,
  minLineY = 0,
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
  const visibleGutterInfos = breakPoints.length > 0 ? getGutterInfos(minLineY, maxLineY, breakPoints, lineNumbers) : gutterInfos
  const showGutter = lineNumbers || breakPoints.length > 0
  const gutterDom = showGutter ? GetEditorGutterLayerVirtualDom.getEditorGutterVirtualDom(visibleGutterInfos) : []
  return [
    {
      childCount: showGutter ? 2 : 1,
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
