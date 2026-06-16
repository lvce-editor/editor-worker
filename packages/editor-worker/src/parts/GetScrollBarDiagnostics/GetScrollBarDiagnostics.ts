import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import type { ScrollBarDiagnostic } from '../ScrollbarDiagnostic/ScrollBarDiagnostic.ts'

export const getScrollBarDiagnostics = (editor: any, diagnostics: readonly Diagnostic[]): readonly ScrollBarDiagnostic[] => {
  const scrollBarDecorations: ScrollBarDiagnostic[] = Array.from(diagnostics, (diagnostic) => ({
    height: 2,
    top: (diagnostic.rowIndex / editor.lines.length) * editor.height,
  }))
  return scrollBarDecorations
}
