import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'

export const measureTextWidthsSlow = async (
  texts: readonly string[],
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
): Promise<readonly number[]> => {
  return (await TextMeasurementWorker.invoke(
    'TextMeasurement.measureTextWidths',
    texts,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    isMonoSpaceFont,
    charWidth,
  )) as readonly number[]
}
