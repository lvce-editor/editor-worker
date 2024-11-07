import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as GetDiagnosticType from '../GetDiagnosticType/GetDiagnosticType.ts'
import * as GetX from '../GetX/GetX.ts'

export const getVisibleDiagnostics = (editor: any, diagnostics: readonly Diagnostic[]): readonly any[] => {
  const visibleDiagnostics = []
  const { columnWidth, rowHeight, minLineY, charWidth, letterSpacing, lines, fontWeight, fontSize, fontFamily, isMonospaceFont, tabSize, charWidth } =
    editor
  for (const diagnostic of diagnostics) {
    const { rowIndex, columnIndex, endColumnIndex } = diagnostic
    const columnDelta = endColumnIndex - columnIndex
    const width = columnDelta * charWidth
    const endLineDifference = 0
    const halfCursorWidth = 0
    const x = GetX.getX(
      lines[rowIndex],
      columnIndex,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      charWidth,
      endLineDifference,
    )

    visibleDiagnostics.push({
      x,
      y: (rowIndex - minLineY) * rowHeight,
      width: width,
      height: rowHeight,
      type: GetDiagnosticType.getDiagnosticType(diagnostic),
    })
  }
  return visibleDiagnostics
}
