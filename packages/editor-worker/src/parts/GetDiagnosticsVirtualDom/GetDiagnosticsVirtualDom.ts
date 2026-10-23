import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetDiagnosticVirtualDom from '../GetDiagnosticVirtualDom/GetDiagnosticVirtualDom.ts'
import * as SortDiagnosticsBySeverity from '../SortDiagnosticsBySeverity/SortDiagnosticsBySeverity.ts'

export const getDiagnosticsVirtualDom = (diagnostics: any[]): readonly VirtualDomNode[] => {
  const dom = SortDiagnosticsBySeverity.sortDiagnosticsBySeverity(diagnostics).flatMap(GetDiagnosticVirtualDom.getDiagnosticVirtualDom)
  return dom
}
