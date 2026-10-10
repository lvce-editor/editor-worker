import { isAscii } from '../IsAscii/IsAscii.ts'
import * as MeasureTextWidthFast from '../MeasureTextWidthFast/MeasureTextWidthFast.ts'
import * as MeasureTextWidthSlow from '../MeasureTextWidthSlow/MeasureTextWidthSlow.ts'
import * as MeasureTextWidthsSlow from '../MeasureTextWidthsSlow/MeasureTextWidthsSlow.ts'

export const measureTextWidth = async (
  text: string,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
): Promise<number> => {
  // TODO maybe have a property for the whole text document
  // whether the document is ASCII or not
  // so that it doesn't need to be checked on every cursor change
  // or scroll position change
  if (isMonoSpaceFont && isAscii(text)) {
    return await MeasureTextWidthFast.measureTextWidthFast(text, charWidth)
  }
  return await MeasureTextWidthSlow.measureTextWidthSlow(text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)
}

export const measureTextWidths = async (
  texts: readonly string[],
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
): Promise<readonly number[]> => {
  const widths = Array.from({ length: texts.length }, (_, index) => index)
  const slowTexts: string[] = []
  const slowIndexes: number[] = []
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i]
    if (isMonoSpaceFont && isAscii(text)) {
      widths[i] = await MeasureTextWidthFast.measureTextWidthFast(text, charWidth)
    } else {
      slowTexts.push(text)
      slowIndexes.push(i)
    }
  }
  if (slowTexts.length > 0) {
    const slowWidths = await MeasureTextWidthsSlow.measureTextWidthsSlow(
      slowTexts,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonoSpaceFont,
      charWidth,
    )
    for (let i = 0; i < slowWidths.length; i++) {
      widths[slowIndexes[i]] = slowWidths[i]
    }
  }
  return widths
}
