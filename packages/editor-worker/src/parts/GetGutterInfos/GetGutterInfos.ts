export const getGutterInfos = (
  minLineY: number,
  maxLineY: number,
  breakPoints: readonly number[],
  showLineNumbers = true,
  lineIndices?: readonly number[],
): readonly any[] => {
  const gutterInfos = []
  const rows = lineIndices || Array.from({ length: maxLineY - minLineY }, (_, index) => minLineY + index)
  for (const rowIndex of rows) {
    const lineNumber = rowIndex + 1
    gutterInfos.push(breakPoints.includes(rowIndex) ? { isBreakpoint: true, lineNumber } : showLineNumbers ? lineNumber : '')
  }
  return gutterInfos
}
