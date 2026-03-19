import type { EditorVirtualDomOptions } from '../EditorVirtualDomOptions/EditorVirtualDomOptions.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetCursorsVirtualDom from '../GetCursorsVirtualDom/GetCursorsVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as GetEditorRowsVirtualDom from '../GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts'
import * as GetSelectionsVirtualDom from '../GetSelectionsVirtualDom/GetSelectionsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorVirtualDom = ({
  cursorInfos,
  diagnostics,
  differences,
  gutterInfos,
  highlightedLine,
  lineNumbers,
  scrollBarDiagnostics,
  selectionInfos,
  textInfos,
}: EditorVirtualDomOptions): readonly VirtualDomNode[] => {
  const cursorInfosArray = [...cursorInfos]
  const diagnosticsArray = [...diagnostics]
  const gutterInfosArray = [...gutterInfos]
  const scrollBarDiagnosticsArray = [...scrollBarDiagnostics]
  const rowsDom = GetEditorRowsVirtualDom.getEditorRowsVirtualDom(textInfos, differences, lineNumbers, highlightedLine)
  const cursorsDom = GetCursorsVirtualDom.getCursorsVirtualDom(cursorInfosArray)
  const selectionsDom = GetSelectionsVirtualDom.getSelectionsVirtualDom(selectionInfos)
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(diagnosticsArray)
  const gutterDom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom(gutterInfosArray)
  const scrollBarDiagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(scrollBarDiagnosticsArray)

  return [
    {
      childCount: 2,
      className: 'Viewlet Editor',
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
      childCount: 4,
      className: 'EditorContent',
      type: VirtualDomElements.Div,
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
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarVertical',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbVertical',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarHorizontal',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb ScrollBarThumbHorizontal',
      type: VirtualDomElements.Div,
    },
  ]
}
