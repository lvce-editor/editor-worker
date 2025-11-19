import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as GetX from '../GetX/GetX.ts'
import * as GetY from '../GetY/GetY.ts'

export const getDiagnosticDecoration = async (
  lines: readonly string[],
  minLineY: number,
  rowHeight: number,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  isMonospaceFont: boolean,
  letterSpacing: number,
  tabSize: number,
  halfCursorWidth: number,
  width: number,
  averageCharWidth: number,
  diagnostic: Diagnostic,
) => {
  const { rowIndex, columnIndex, endColumnIndex, type } = diagnostic
  const y = GetY.getY(rowIndex, minLineY, rowHeight)
  const line = lines[rowIndex]
  const startX = await GetX.getX(
    line,
    columnIndex,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
  )
  const endX = await GetX.getX(
    line,
    endColumnIndex,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    halfCursorWidth,
    width,
    averageCharWidth,
  )
  const decorationWidth = endX - startX
  return {
    x: startX,
    y,
    width: decorationWidth,
    height: rowHeight,
    type,
  }
}
