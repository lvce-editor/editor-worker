export const getGutterInfos = (minLineY: number, maxLineY: number, breakPoints: readonly number[], showLineNumbers = true): readonly any[] => {
  const gutterInfos = []
  for (let rowIndex = minLineY; rowIndex < maxLineY; rowIndex++) {
    const lineNumber = rowIndex + 1
    gutterInfos.push(breakPoints.includes(rowIndex) ? { isBreakpoint: true, lineNumber } : showLineNumbers ? lineNumber : '')
  }
  return gutterInfos
}
