import * as TextMeasurementWorker from '../TextMeasurementWorker/TextMeasurementWorker.ts'

export const measureTextWidthSlow = async (
  text: string,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
): Promise<number> => {
  const width = await TextMeasurementWorker.invoke(
    'TextMeasurement.measureTextWidth',
    text,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    isMonoSpaceFont,
    charWidth,
  )
  return width
}
