import type { EditorGutterDecoration } from '../EditorGutterDecoration/EditorGutterDecoration.ts'

export const getGutterInfos = (
  minLineY: number,
  maxLineY: number,
  breakPoints: readonly number[],
  showLineNumbers = true,
  lineIndices?: readonly number[],
  lightBulbRowIndex = -1,
  gutterDecorations: readonly EditorGutterDecoration[] = [],
): readonly any[] => {
  const gutterInfos = []
  const rows = lineIndices || Array.from({ length: maxLineY - minLineY }, (_, index) => minLineY + index)
  for (const rowIndex of rows) {
    const lineNumber = rowIndex + 1
    const isBreakpoint = breakPoints.includes(rowIndex)
    const isLightBulb = rowIndex === lightBulbRowIndex
    const rowDecorations = gutterDecorations.filter((decoration) => decoration.rowIndex === rowIndex)
    if (isLightBulb) {
      gutterInfos.push({ ...(rowDecorations.length > 0 && { gutterDecorations: rowDecorations }), isBreakpoint, isLightBulb: true, lineNumber })
    } else if (isBreakpoint) {
      gutterInfos.push({ ...(rowDecorations.length > 0 && { gutterDecorations: rowDecorations }), isBreakpoint: true, lineNumber })
    } else if (rowDecorations.length > 0) {
      gutterInfos.push({ gutterDecorations: rowDecorations, lineNumber, showLineNumber: showLineNumbers })
    } else {
      gutterInfos.push(showLineNumbers ? lineNumber : '')
    }
  }
  return gutterInfos
}
