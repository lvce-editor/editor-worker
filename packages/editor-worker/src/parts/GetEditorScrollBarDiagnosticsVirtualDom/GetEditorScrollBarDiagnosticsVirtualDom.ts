import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorScrollBarDiagnosticsVirtualDom = (scrollBarDiagnostics: readonly any[]): readonly VirtualDomNode[] => {
  return [
    {
      childCount: scrollBarDiagnostics.length,
      className: 'EditorScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom([...scrollBarDiagnostics]),
  ]
}
