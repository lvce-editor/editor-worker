import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const measureCharacterWidth = async (fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: number): Promise<number> => {
  return await MeasureTextWidth.measureTextWidth('a', fontWeight, fontSize, fontFamily, letterSpacing, false, 0)
}
