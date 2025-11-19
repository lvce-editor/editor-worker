import * as MeasureTextWidthFast from '../MeasureTextWidthFast/MeasureTextWidthFast.ts'
import * as MeasureTextWidthSlow from '../MeasureTextWidthSlow/MeasureTextWidthSlow.ts'

export const measureTextWidth = async (
  text: string,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
): Promise<number> => {
  if (isMonoSpaceFont) {
    return await MeasureTextWidthFast.measureTextWidthFast(text, charWidth)
  }
  return await MeasureTextWidthSlow.measureTextWidthSlow(text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)
}
