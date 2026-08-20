export const getGutterInfos = (
  minLineY: number,
  maxLineY: number,
  breakPoints: readonly number[],
  showLineNumbers = true,
  lineIndices?: readonly number[],
  lightBulbRowIndex = -1,
): readonly any[] => {
  const gutterInfos = []
  const rows = lineIndices || Array.from({ length: maxLineY - minLineY }, (_, index) => minLineY + index)
  for (const rowIndex of rows) {
    const lineNumber = rowIndex + 1
    const isBreakpoint = breakPoints.includes(rowIndex)
    const isLightBulb = rowIndex === lightBulbRowIndex
    if (isLightBulb) {
      gutterInfos.push({ isBreakpoint, isLightBulb: true, lineNumber })
    } else if (isBreakpoint) {
      gutterInfos.push({ isBreakpoint: true, lineNumber })
    } else {
      gutterInfos.push(showLineNumbers ? lineNumber : '')
    }
  }
  return gutterInfos
}
