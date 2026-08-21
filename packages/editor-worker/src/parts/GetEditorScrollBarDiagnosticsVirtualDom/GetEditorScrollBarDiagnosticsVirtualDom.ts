import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DiagnosticType from '../DiagnosticType/DiagnosticType.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import type { ScrollBarDiagnostic } from '../ScrollbarDiagnostic/ScrollBarDiagnostic.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getClassName = (type: string): string => {
  if (type === DiagnosticType.Warning) {
    return MergeClassNames.mergeClassNames(ClassNames.ScrollBarDiagnostic, ClassNames.ScrollBarDiagnosticWarning)
  }
  return MergeClassNames.mergeClassNames(ClassNames.ScrollBarDiagnostic, ClassNames.ScrollBarDiagnosticError)
}

export const getEditorScrollBarDiagnosticsVirtualDom = (scrollBarDiagnostics: readonly ScrollBarDiagnostic[]): readonly VirtualDomNode[] => {
  return [
    {
      childCount: scrollBarDiagnostics.length,
      className: 'ScrollBarDiagnostics',
      type: VirtualDomElements.Div,
    },
    ...scrollBarDiagnostics.map(({ height, top, type }) => ({
      childCount: 0,
      className: getClassName(type),
      height,
      top,
      type: VirtualDomElements.Div,
    })),
  ]
}
