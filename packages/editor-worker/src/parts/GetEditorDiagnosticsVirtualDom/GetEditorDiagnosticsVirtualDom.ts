import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorDiagnosticsVirtualDom = (diagnostics: readonly any[]): readonly VirtualDomNode[] => {
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom([...diagnostics])
  return [
    {
      childCount: diagnostics.length,
      className: 'LayerDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...diagnosticsDom,
  ]
}
