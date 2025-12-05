import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import type { ScrollBarDiagnostic } from '../ScrollbarDiagnostic/ScrollBarDiagnostic.ts'

export const getScrollBarDiagnostics = (editor: any, diagnostics: readonly Diagnostic[]): readonly ScrollBarDiagnostic[] => {
  const scrollBarDecorations: ScrollBarDiagnostic[] = []
  for (const diagnostic of diagnostics) {
    scrollBarDecorations.push({
      height: 2,
      top: (diagnostic.rowIndex / editor.lines.length) * editor.height,
    })
  }
  return scrollBarDecorations
}
