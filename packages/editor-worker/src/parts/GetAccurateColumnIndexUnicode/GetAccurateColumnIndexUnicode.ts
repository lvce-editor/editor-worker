import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'
import * as TextSegmenter from '../TextSegmenter/TextSegmenter.ts'

// @ts-ignore
export const getAccurateColumnIndexUnicode = async (
  line,
  guess,
  averageCharWidth,
  eventX,
  fontWeight,
  fontSize,
  fontFamily,
  letterSpacing,
): Promise<number> => {
  const segmenter = TextSegmenter.create()
  const segments = segmenter.getSegments(line)
  const isMonospaceFont = false
  const charWidth = 0
  for (const segment of segments) {
    const width = await MeasureTextWidth.measureTextWidth(
      line.slice(0, segment.index),
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth,
    )
    if (eventX - width < averageCharWidth) {
      return segment.index
    }
  }
  return line.length
}
