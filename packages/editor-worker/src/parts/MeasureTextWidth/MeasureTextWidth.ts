import * as MeasureTextWidthFast from '../MeasureTextWidthFast/MeasureTextWidthFast.ts'
import * as MeasureTextWidthSlow from '../MeasureTextWidthSlow/MeasureTextWidthSlow.ts'

export const measureTextWidth = (
  text: string,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
): number => {
  if (isMonoSpaceFont) {
    return MeasureTextWidthFast.measureTextWidthFast(text, charWidth)
  }
  return MeasureTextWidthSlow.measureTextWidthSlow(text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)
}
