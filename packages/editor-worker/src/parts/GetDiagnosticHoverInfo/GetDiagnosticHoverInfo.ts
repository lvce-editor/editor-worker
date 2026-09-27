import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as GetDiagnosticHoverDetail from '../GetDiagnosticHoverDetail/GetDiagnosticHoverDetail.ts'
import * as MeasureTextHeight from '../MeasureTextHeight/MeasureTextHeight.ts'

const maximumWidth = 600
const horizontalPadding = 18

export const getDiagnosticHoverInfo = async (editor: any, diagnostic: Diagnostic) => {
  const { columnIndex, message, rowIndex } = diagnostic
  const width = Math.min(maximumWidth, editor.width)
  const detail = GetDiagnosticHoverDetail.getDiagnosticHoverDetail(diagnostic)
  const diagnosticText = detail ? `${message} ${detail}` : message
  const measuredHeight = await MeasureTextHeight.measureTextBlockHeight(
    diagnosticText,
    editor.fontFamily,
    editor.fontSize,
    `${editor.rowHeight}px`,
    width - horizontalPadding,
  )
  const height = Math.min(measuredHeight + 10, editor.height)
  const positionX = editor.x + columnIndex * editor.columnWidth - (editor.deltaX || 0)
  const x = Math.max(editor.x, Math.min(positionX, editor.x + editor.width - width))
  const rowBottom = editor.y + (rowIndex + 1) * editor.rowHeight - (editor.deltaY || 0)
  const y = rowBottom + height <= editor.y + editor.height ? rowBottom : Math.max(editor.y, rowBottom - editor.rowHeight - height)
  return {
    diagnostics: [diagnostic],
    documentation: '',
    height,
    lineInfos: [],
    width,
    x,
    y,
  }
}
