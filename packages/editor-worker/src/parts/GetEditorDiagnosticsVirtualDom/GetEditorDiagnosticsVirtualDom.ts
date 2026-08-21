import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetBracketMatchesVirtualDom from '../GetBracketMatchesVirtualDom/GetBracketMatchesVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorDiagnosticsVirtualDom = (diagnostics: readonly any[], bracketMatchInfos: readonly any[] = []): readonly VirtualDomNode[] => {
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom([...diagnostics])
  const bracketMatchesDom = GetBracketMatchesVirtualDom.getBracketMatchesVirtualDom(bracketMatchInfos)
  return [
    {
      childCount: diagnostics.length + bracketMatchInfos.length,
      className: 'LayerDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...diagnosticsDom,
    ...bracketMatchesDom,
  ]
}
