import type { BidiMeasure } from '../Bidi/Bidi.ts'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const joiningScript = /\p{Script=Arabic}/u

export const createMeasure = (
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  tabSize: number,
  charWidth: number,
): BidiMeasure => {
  // Owned by this geometry operation, so edits/font changes cannot reuse stale
  // shaping information and closing editors leaves no persistent text cache.
  const cache = new Map<string, Promise<number>>()
  const normalize = (text: string): string => text.replaceAll('\t', () => ' '.repeat(tabSize))
  return (text, context) => {
    const key = JSON.stringify([text, context])
    let result = cache.get(key)
    if (!result) {
      if (context && context.offset > 0 && context.offset < context.text.length && joiningScript.test(context.text)) {
        const normalizedOffset = normalize(context.text.slice(0, context.offset)).length
        result = RendererProcess.invoke(
          'MeasureBidi.measurePrefix',
          normalize(context.text),
          normalizedOffset,
          fontWeight,
          fontSize,
          fontFamily,
          letterSpacing,
          context.rtl ? 'rtl' : 'ltr',
        )
      } else {
        // The measurement worker's monospace shortcut assumes every glyph has
        // the ASCII width; RTL fonts and fallback glyphs need real measurement.
        result = MeasureTextWidth.measureTextWidth(normalize(text), fontWeight, fontSize, fontFamily, letterSpacing, false, charWidth)
      }
      cache.set(key, result)
    }
    return result
  }
}
