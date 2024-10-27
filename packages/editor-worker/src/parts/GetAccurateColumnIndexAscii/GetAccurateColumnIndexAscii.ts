import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const getAccurateColumnIndexAscii = (
  line: string,
  guess: number,
  averageCharWidth: number,
  eventX: number,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonospaceFont: boolean,
  charWidth: number
) => {
  for (let i = guess; i < line.length; i++) {
    const width = MeasureTextWidth.measureTextWidth(line.slice(0, i), fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth)
    if (eventX - width < averageCharWidth / 2) {
      return i
    }
  }
  return line.length
}
