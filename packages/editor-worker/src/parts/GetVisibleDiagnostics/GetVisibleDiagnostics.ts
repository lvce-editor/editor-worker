import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as GetDiagnosticType from '../GetDiagnosticType/GetDiagnosticType.ts'

export const getVisibleDiagnostics = (editor: any, diagnostics: readonly Diagnostic[]): readonly any[] => {
  const visibleDiagnostics = []
  for (const diagnostic of diagnostics) {
    visibleDiagnostics.push({
      x: diagnostic.columnIndex * editor.columnWidth,
      y: (diagnostic.rowIndex - editor.minLineY) * editor.rowHeight,
      width: 20,
      height: editor.rowHeight,
      type: GetDiagnosticType.getDiagnosticType(diagnostic),
    })
  }
  return visibleDiagnostics
}
