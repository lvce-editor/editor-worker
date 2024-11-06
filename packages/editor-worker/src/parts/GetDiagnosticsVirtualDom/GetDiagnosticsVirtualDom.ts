import * as GetDiagnosticVirtualDom from '../GetDiagnosticVirtualDom/GetDiagnosticVirtualDom.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export const getDiagnosticsVirtualDom = (diagnostics: any[]): readonly VirtualDomNode[] => {
  const dom = diagnostics.flatMap(GetDiagnosticVirtualDom.getDiagnosticVirtualDom)
  return dom
}
