import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetEditorCursorsVirtualDom from '../GetEditorCursorsVirtualDom/GetEditorCursorsVirtualDom.ts'
import * as GetEditorDiagnosticsVirtualDom from '../GetEditorDiagnosticsVirtualDom/GetEditorDiagnosticsVirtualDom.ts'
import * as GetEditorRowsLayerVirtualDom from '../GetEditorRowsLayerVirtualDom/GetEditorRowsLayerVirtualDom.ts'
import * as GetEditorSelectionsVirtualDom from '../GetEditorSelectionsVirtualDom/GetEditorSelectionsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const editorLayersNode: VirtualDomNode = {
  childCount: 4,
  className: 'EditorLayers',
  type: VirtualDomElements.Div,
}

export const getEditorLayersVirtualDom = (
  selectionInfos: readonly any[],
  textInfos: readonly any[],
  differences: readonly number[],
  lineNumbers = true,
  highlightedLine = -1,
  cursorInfos: readonly any[] = [],
  diagnostics: readonly any[] = [],
): readonly VirtualDomNode[] => {
  return [
    editorLayersNode,
    ...GetEditorSelectionsVirtualDom.getEditorSelectionsVirtualDom(selectionInfos),
    ...GetEditorRowsLayerVirtualDom.getEditorRowsVirtualDom(textInfos, differences, lineNumbers, highlightedLine),
    ...GetEditorCursorsVirtualDom.getEditorCursorsVirtualDom(cursorInfos),
    ...GetEditorDiagnosticsVirtualDom.getEditorDiagnosticsVirtualDom(diagnostics),
  ]
}
