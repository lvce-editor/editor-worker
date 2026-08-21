import type { ScrollBarDiagnostic } from '../ScrollbarDiagnostic/ScrollBarDiagnostic.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorScrollBarDiagnosticsVirtualDom = (scrollBarDiagnostics: readonly ScrollBarDiagnostic[]): readonly VirtualDomNode[] => {
  return [
    {
      childCount: scrollBarDiagnostics.length,
      className: 'ScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...scrollBarDiagnostics.map(({ height, top, type }) => ({
      childCount: 0,
      className: type === 'warning' ? 'ScrollBarDiagnostic ScrollBarDiagnosticWarning' : 'ScrollBarDiagnostic ScrollBarDiagnosticError',
      height,
      top,
      type: VirtualDomElements.Div,
    })),
  ]
}
