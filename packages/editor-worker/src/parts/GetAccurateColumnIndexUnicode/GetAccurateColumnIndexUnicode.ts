import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'
import * as TextSegmenter from '../TextSegmenter/TextSegmenter.ts'

export const getAccurateColumnIndexUnicode = async (
  line: string,
  guess: number,
  averageCharWidth: number,
  eventX: number,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
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
