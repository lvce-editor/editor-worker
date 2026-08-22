import type { DocumentSymbol } from '../DocumentSymbol/DocumentSymbol.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetEditorBreadcrumbsVirtualDom from '../GetEditorBreadcrumbsVirtualDom/GetEditorBreadcrumbsVirtualDom.ts'
import * as GetEditorContentVirtualDom from '../GetEditorContentVirtualDom/GetEditorContentVirtualDom.ts'
import * as GetEditorGutterLayerVirtualDom from '../GetEditorGutterLayerVirtualDom/GetEditorGutterLayerVirtualDom.ts'
import { getGutterInfos } from '../GetGutterInfos/GetGutterInfos.ts'
import { getPrimaryCursorRowIndex } from '../GetPrimaryCursorRowIndex/GetPrimaryCursorRowIndex.ts'
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
  readonly bracketMatchInfos?: readonly any[]
  readonly breadcrumbsEnabled?: boolean
  readonly breakPoints?: readonly number[]
  readonly cursorInfos?: readonly any[]
  readonly deltaY?: number
  readonly diagnostics?: readonly any[]
  readonly differences: readonly number[]
  readonly documentSymbols?: readonly DocumentSymbol[]
  readonly endOfLineDecorations?: readonly { readonly rowIndex: number; readonly text: string }[]
  readonly finalDeltaY?: number
  readonly gutterInfos?: readonly any[]
  readonly height?: number
  readonly highlightedLine?: number
  readonly lightBulbRowIndex?: number
  readonly lineNumbers?: boolean
  readonly lines?: readonly string[]
  readonly loadError?: string
  readonly maxLineY?: number
  readonly minimapEnabled?: boolean
  readonly minimapLines?: readonly (readonly (number | string)[])[]
  readonly minLineY?: number
  readonly primarySelectionIndex?: number
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly selectionInfos?: readonly any[]
  readonly selections?: any
  readonly textInfos: readonly any[]
  readonly uid: number
  readonly uri?: string
  readonly visibleLineIndices?: readonly number[]
  readonly workspaceUri?: string
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
      'data-lineCount': minimapLines.length,
      'data-visibleStart': minLineY,
      type: VirtualDomElements.Div,
    },
  ]
}

export const getEditorVirtualDom = ({
  bracketMatchInfos = [],
  breadcrumbsEnabled = false,
  breakPoints = [],
  cursorInfos = [],
  diagnostics = [],
  differences,
  documentSymbols = [],
  endOfLineDecorations = [],
  gutterInfos = [],
  highlightedLine = -1,
  lightBulbRowIndex = -1,
  lineNumbers = true,
  lines = [],
  loadError = '',
  maxLineY = 0,
  minimapEnabled = false,
  minimapLines = [],
  minLineY = 0,
  primarySelectionIndex = 0,
  scrollBarDiagnostics = [],
  selectionInfos = [],
  selections = new Uint32Array(),
  textInfos,
  uid,
  uri = '',
  visibleLineIndices,
  workspaceUri = '',
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
    breakPoints.length > 0 || visibleLineIndices
      ? getGutterInfos(minLineY, maxLineY, breakPoints, lineNumbers, visibleLineIndices, lightBulbRowIndex)
      : gutterInfos
  const showGutter = lineNumbers || breakPoints.length > 0 || lightBulbRowIndex >= 0
  const primaryCursorRowIndex = getPrimaryCursorRowIndex(selections, primarySelectionIndex)
  const gutterDom = showGutter ? GetEditorGutterLayerVirtualDom.getEditorGutterVirtualDom(visibleGutterInfos, primaryCursorRowIndex + 1) : []
  const minimapDom = getMinimapVirtualDom(minimapEnabled, minimapLines, minLineY)
  const breadcrumbsDom = breadcrumbsEnabled
    ? GetEditorBreadcrumbsVirtualDom.getEditorBreadcrumbsVirtualDom({
        breadcrumbsEnabled,
        documentSymbols,
        lines,
        primarySelectionIndex,
        selections,
        uri,
        workspaceUri,
      })
    : []
  return [
    {
      childCount: (showGutter ? 2 : 1) + (minimapEnabled ? 1 : 0) + (breadcrumbsEnabled ? 1 : 0),
      className: MergeClassNames.mergeClassNames('Viewlet', 'Editor'),
      'data-uid': uid,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      role: AriaRoles.Code,
      type: VirtualDomElements.Div,
    },
    ...breadcrumbsDom,
    ...gutterDom,
    ...GetEditorContentVirtualDom.getEditorContentVirtualDom({
      bracketMatchInfos,
      cursorInfos,
      diagnostics,
      differences,
      endOfLineDecorations,
      highlightedLine,
      lineNumbers,
      scrollBarDiagnostics,
      selectionInfos,
      textInfos,
      visibleLineIndices: visibleLineIndices || [],
    }),
    ...minimapDom,
  ]
}
