import * as Assert from '../Assert/Assert.ts'
import * as GetFontString from '../GetFontString/GetFontString.ts'
import * as GetLetterSpacingString from '../GetLetterSpacingString/GetLetterSpacingString.ts'
import * as GetTextMeasureContext from '../GetTextMeasureContext/GetTextMeasureContext.ts'

export const measureTextWidth = (
  text: string,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
): number => {
  Assert.string(text)
  Assert.number(fontWeight)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  Assert.boolean(isMonoSpaceFont)
  Assert.number(charWidth)
  if (isMonoSpaceFont) {
    return text.length * charWidth
  }
  if (typeof letterSpacing !== 'number') {
    throw new TypeError('letterSpacing must be of type number')
  }
  const letterSpacingString = GetLetterSpacingString.getLetterSpacingString(letterSpacing)
  const fontString = GetFontString.getFontString(fontWeight, fontSize, fontFamily)
  const ctx = GetTextMeasureContext.getContext()
  ctx.letterSpacing = letterSpacingString
  ctx.font = fontString
  const metrics = ctx.measureText(text)
  const width = metrics.width
  return width
}
