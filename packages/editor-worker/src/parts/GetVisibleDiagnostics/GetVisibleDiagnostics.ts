import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as EditorViewRows from '../EditorViewRows/EditorViewRows.ts'
import * as GetDiagnosticType from '../GetDiagnosticType/GetDiagnosticType.ts'
import * as GetX from '../GetX/GetX.ts'

export const getVisibleDiagnostics = async (editor: any, diagnostics: readonly Diagnostic[]): Promise<readonly any[]> => {
  const visibleDiagnostics = []
  const {
    charWidth,
    deltaY,
    fontFamily,
    fontSize,
    fontWeight,
    isMonospaceFont,
    itemHeight,
    letterSpacing,
    lines,
    rowHeight,
    tabSize,
    viewLineIndices,
    width,
  } = editor
  const startVisualRow = itemHeight ? Math.floor(deltaY / itemHeight) : editor.minLineY || 0
  for (const diagnostic of diagnostics) {
    const { columnIndex, endColumnIndex, rowIndex } = diagnostic
    const columnDelta = Math.max(1, endColumnIndex - columnIndex)
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
    const visualRow = viewLineIndices ? EditorViewRows.getVisualRowForDocumentRow(rowIndex, viewLineIndices) : rowIndex
    const y = (visualRow - startVisualRow) * rowHeight
    visibleDiagnostics.push({
      height: rowHeight,
      type: GetDiagnosticType.getDiagnosticType(diagnostic),
      width: diagnosticWidth,
      x,
      y,
    })
  }
  return visibleDiagnostics
}
