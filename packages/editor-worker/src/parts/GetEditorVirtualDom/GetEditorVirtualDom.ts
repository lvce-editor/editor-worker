import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorContentVirtualDom from '../GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as GetEditorGutterLayerVirtualDom from '../GetEditorGutterLayerVirtualDom/GetEditorGutterLayerVirtualDom.ts'
import { getGutterInfos } from '../GetGutterInfos/GetGutterInfos.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const textEditorErrorIconNode: VirtualDomNode = {
  childCount: 0,
  className: MergeClassNames.mergeClassNames('EditorTextIcon', 'EditorTextIconError', 'MaskIcon', 'MaskIconError'),
  type: VirtualDomElements.Div,
}

const textEditorErrorMessageNode: VirtualDomNode = {
  childCount: 1,
  className: 'TextEditorErrorMessage',
  type: VirtualDomElements.Div,
}

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
  readonly minimapEnabled?: boolean
  readonly minimapLines?: readonly (readonly (number | string)[])[]
  readonly minLineY?: number
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly selectionInfos?: readonly any[]
  readonly selections?: any
  readonly textInfos: readonly any[]
  readonly uid: number
  readonly visibleLineIndices?: readonly number[]
}

const getMinimapVirtualDom = (
  minimapEnabled: boolean,
  minimapLines: readonly (readonly (number | string)[])[],
  minLineY: number,
): readonly VirtualDomNode[] => {
  if (!minimapEnabled) {
    return []
  }
  return [
    {
      ariaHidden: AriaBoolean.True,
      childCount: 0,
      className: 'EditorMinimap',
      'data-line-count': minimapLines.length,
      'data-visible-start': minLineY,
      type: VirtualDomElements.Div,
    },
  ]
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
  minimapEnabled = false,
  minimapLines = [],
  minLineY = 0,
  scrollBarDiagnostics = [],
  selectionInfos = [],
  textInfos,
  uid,
  visibleLineIndices,
}: EditorVirtualDomOptions): readonly VirtualDomNode[] => {
  if (loadError) {
    return [
      {
        childCount: 2,
        className: MergeClassNames.mergeClassNames('Viewlet', 'TextEditorError'),
        'data-uid': uid,
        role: AriaRoles.Code,
        type: VirtualDomElements.Div,
      },
      textEditorErrorIconNode,
      textEditorErrorMessageNode,
      text(loadError),
    ]
  }
  const visibleGutterInfos =
    breakPoints.length > 0 || visibleLineIndices ? getGutterInfos(minLineY, maxLineY, breakPoints, lineNumbers, visibleLineIndices) : gutterInfos
  const showGutter = lineNumbers || breakPoints.length > 0
  const gutterDom = showGutter ? GetEditorGutterLayerVirtualDom.getEditorGutterVirtualDom(visibleGutterInfos) : []
  const minimapDom = getMinimapVirtualDom(minimapEnabled, minimapLines, minLineY)
  return [
    {
      childCount: (showGutter ? 2 : 1) + (minimapEnabled ? 1 : 0),
      className: MergeClassNames.mergeClassNames('Viewlet', 'Editor'),
      'data-uid': uid,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      role: AriaRoles.Code,
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
    ...minimapDom,
  ]
}
