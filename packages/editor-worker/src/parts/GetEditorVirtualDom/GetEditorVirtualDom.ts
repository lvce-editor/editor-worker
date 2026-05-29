import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

interface EditorVirtualDomOptions {
  readonly cursorInfos?: readonly any[]
  readonly diagnostics?: readonly any[]
  readonly differences: readonly number[]
  readonly gutterInfos?: readonly any[]
  readonly highlightedLine?: number
  readonly lineNumbers?: boolean
  readonly scrollBarDiagnostics?: readonly any[]
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
  selections = [],
  textInfos,
}: EditorVirtualDomOptions): readonly VirtualDomNode[] => {
  const cursorInfosArray = [...cursorInfos]
  const diagnosticsArray = [...diagnostics]
  const gutterInfosArray = [...gutterInfos]
  const scrollBarDiagnosticsArray = [...scrollBarDiagnostics]
  const rowsDom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences, lineNumbers, highlightedLine)
  const cursorsDom = GetCursorsVirtualDom.getCursorsVirtualDom(cursorInfosArray)
  const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos || selections)
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(diagnosticsArray)
  const gutterDom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom(gutterInfosArray)
  const scrollBarDiagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(scrollBarDiagnosticsArray)
  const scrollBarDom = GetScrollBarVirtualDom.getScrollBarVirtualDom()

  return [
    {
      childCount: 2,
      className: 'Viewlet Editor',
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onWheel: DomEventListenerFunctions.HandleWheel,
      role: 'code',
      type: VirtualDomElements.Div,
    },
    {
      childCount: gutterInfosArray.length,
      className: 'Gutter',
      type: VirtualDomElements.Div,
    },
    ...gutterDom,
    {
      childCount: 5,
      className: 'EditorContent',
      onMouseMove: DomEventListenerFunctions.HandleMouseMove,
      type: VirtualDomElements.Div,
    },
    {
      ariaAutoComplete: 'list',
      ariaMultiLine: 'true',
      ariaRoleDescription: 'editor',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: 'EditorInput',
      name: 'editor',
      onBeforeInput: DomEventListenerFunctions.HandleBeforeInput,
      onBlur: DomEventListenerFunctions.HandleBlur,
      onCompositionEnd: DomEventListenerFunctions.HandleCompositionEnd,
      onCompositionStart: DomEventListenerFunctions.HandleCompositionStart,
      onCompositionUpdate: DomEventListenerFunctions.HandleCompositionUpdate,
      onCut: DomEventListenerFunctions.HandleCut,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onPaste: DomEventListenerFunctions.HandlePaste,
      role: 'textbox',
      spellcheck: false,
      type: VirtualDomElements.TextArea,
      wrap: 'off',
    },
    {
      childCount: 4,
      className: 'EditorLayers',
      type: VirtualDomElements.Div,
    },
    {
      childCount: selectionsDom.length,
      className: 'Selections',
      type: VirtualDomElements.Div,
    },
    ...selectionsDom,
    {
      childCount: textInfos.length,
      className: 'EditorRows',
      // onMouseDown: DomEventListenerFunctions.HandleMouseDown,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      type: VirtualDomElements.Div,
    },
    ...rowsDom,
    {
      childCount: cursorsDom.length,
      className: 'LayerCursor',
      type: VirtualDomElements.Div,
    },
    ...cursorsDom,
    {
      childCount: diagnosticsDom.length,
      className: 'LayerDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...diagnosticsDom,
    {
      childCount: scrollBarDiagnosticsDom.length,
      className: 'EditorScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...scrollBarDiagnosticsDom,
    ...scrollBarDom,
  ]
}
