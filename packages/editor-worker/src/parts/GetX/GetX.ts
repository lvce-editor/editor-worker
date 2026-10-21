import * as Assert from '../Assert/Assert.ts'
import * as Bidi from '../Bidi/Bidi.ts'
import * as GetTabCount from '../GetTabCount/GetTabCount.ts'
import * as MeasureBidi from '../MeasureBidi/MeasureBidi.ts'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'
import * as NormalizeText from '../NormalizeText/NormalizeText.ts'

export const getX = async (
  line: string,
  column: number,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  isMonospaceFont: boolean,
  letterSpacing: number,
  tabSize: number,
  halfCursorWidth: number,
  width: number,
  averageCharWidth: number,
  difference = 0,
  measuredLineWidth?: number,
  rtl = false,
): Promise<number> => {
  if (!line) {
    return 0
  }
  Assert.string(line)
  Assert.number(tabSize)
  Assert.number(halfCursorWidth)
  Assert.number(width)
  Assert.boolean(isMonospaceFont)
  Assert.number(averageCharWidth)
  Assert.number(difference)
  if (Bidi.isBidi(line, rtl)) {
    const measure = MeasureBidi.createMeasure(fontWeight, fontSize, fontFamily, letterSpacing, tabSize, averageCharWidth)
    const x = await Bidi.getPosition(line, column, measure)
    return Math.min(width, x - halfCursorWidth + difference)
  }
  if (column === 0) {
    return difference === 0 ? 0 : Math.min(width, difference)
  }
  // TODO support non-monospace font, emoji, tab character, zero width characters
  const normalize = NormalizeText.shouldNormalizeText(line)
  const normalizedLine = NormalizeText.normalizeText(line, normalize, tabSize)
  const tabCount = GetTabCount.getTabCount(line.slice(0, column))
  const partialText = normalizedLine.slice(0, column + tabCount * (tabSize - 1))
  const textWidth =
    column === line.length && measuredLineWidth !== undefined
      ? measuredLineWidth
      : await MeasureTextWidth.measureTextWidth(partialText, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, averageCharWidth)
  return Math.min(width, textWidth - halfCursorWidth + difference)
}
