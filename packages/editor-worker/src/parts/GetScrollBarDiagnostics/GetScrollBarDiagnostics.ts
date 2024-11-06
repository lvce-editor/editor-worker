import { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import type { ScrollBarDiagnostic } from '../ScrollbarDiagnostic/ScrollBarDiagnostic.ts'

export const getScrollBarDiagnostics = (editor: any, diagnostics: readonly Diagnostic[]): readonly ScrollBarDiagnostic[] => {
  const scrollBarDecorations: ScrollBarDiagnostic[] = []
  for (const diagnostic of diagnostics) {
    scrollBarDecorations.push({
      top: (diagnostic.rowIndex / editor.lines.length) * editor.height,
      height: 2,
    })
  }
  return scrollBarDecorations
}
