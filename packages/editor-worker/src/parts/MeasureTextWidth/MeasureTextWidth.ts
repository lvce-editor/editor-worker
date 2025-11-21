import { isAscii } from '../IsAscii/IsAscii.ts'
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
  // TODO maybe have a property for the whole text document
  // whether the document is ascii or not
  // so that it doesn't need to be checked on every cursor change
  // or scroll position change
  if (isMonoSpaceFont && isAscii(text)) {
    return await MeasureTextWidthFast.measureTextWidthFast(text, charWidth)
  }
  return await MeasureTextWidthSlow.measureTextWidthSlow(text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)
}
