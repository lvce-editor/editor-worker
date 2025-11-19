import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as GetDiagnosticType from '../GetDiagnosticType/GetDiagnosticType.ts'
import * as GetX from '../GetX/GetX.ts'
import * as GetY from '../GetY/GetY.ts'

export const getVisibleDiagnostics = async (editor: any, diagnostics: readonly Diagnostic[]): Promise<readonly any[]> => {
  const visibleDiagnostics = []
  const { width, rowHeight, minLineY, charWidth, letterSpacing, lines, fontWeight, fontSize, fontFamily, isMonospaceFont, tabSize } = editor
  for (const diagnostic of diagnostics) {
    const { rowIndex, columnIndex, endColumnIndex } = diagnostic
    const columnDelta = endColumnIndex - columnIndex
    const diagnosticWidth = columnDelta * charWidth
    const endLineDifference = 0
    const halfCursorWidth = 0
    const x = await GetX.getX(
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
    const y = GetY.getY(rowIndex, minLineY, rowHeight) - rowHeight
    visibleDiagnostics.push({
      x,
      y,
      width: diagnosticWidth,
      height: rowHeight,
      type: GetDiagnosticType.getDiagnosticType(diagnostic),
    })
  }
  return visibleDiagnostics
}
