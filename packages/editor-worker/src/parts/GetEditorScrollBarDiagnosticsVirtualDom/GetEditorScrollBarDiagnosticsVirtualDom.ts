import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorScrollBarDiagnosticsVirtualDom = (scrollBarDiagnostics: readonly any[]): readonly VirtualDomNode[] => {
  const scrollBarDiagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom([...scrollBarDiagnostics])
  return [
    {
      childCount: scrollBarDiagnostics.length,
      className: 'EditorScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...scrollBarDiagnosticsDom,
  ]
}
