import * as CharacterWidthCache from '../CharacterWidthCache/CharacterWidthCache.ts'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const measureCharacterWidth = async (fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: number): Promise<number> => {
  try {
    const cachedWidth = await CharacterWidthCache.get(fontWeight, fontSize, fontFamily, letterSpacing)
    if (cachedWidth !== undefined) {
      return cachedWidth
    }
  } catch {
    // Cache failures must not prevent editor creation.
  }
  const width = await MeasureTextWidth.measureTextWidth('a', fontWeight, fontSize, fontFamily, letterSpacing, false, 0)
  try {
    await CharacterWidthCache.set(fontWeight, fontSize, fontFamily, letterSpacing, width)
  } catch {
    // Cache failures must not prevent editor creation.
  }
  return width
}
