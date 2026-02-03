import * as TextMeasurementWorker from '../TextMeasurementWorker/TextMeasurementWorker.ts'

export const ensure = async (fontName: string, fontUrl: string) => {
  await TextMeasurementWorker.invoke('TextMeasurement.ensureFont', fontName, fontUrl)
}
