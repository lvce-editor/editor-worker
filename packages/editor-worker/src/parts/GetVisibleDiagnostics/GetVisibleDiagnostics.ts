import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as GetDiagnosticType from '../GetDiagnosticType/GetDiagnosticType.ts'

export const getVisibleDiagnostics = (editor: any, diagnostics: readonly Diagnostic[]): readonly any[] => {
  const visibleDiagnostics = []
  const { columnWidth, rowHeight, minLineY, charWidth } = editor
  for (const diagnostic of diagnostics) {
    const { rowIndex, columnIndex, endColumnIndex } = diagnostic
    const columnDelta = endColumnIndex - columnIndex
    const width = columnDelta * charWidth
    visibleDiagnostics.push({
      x: columnIndex * columnWidth,
      y: (rowIndex - minLineY) * rowHeight,
      width: width,
      height: rowHeight,
      type: GetDiagnosticType.getDiagnosticType(diagnostic),
    })
  }
  return visibleDiagnostics
}
