import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'

export const ensure = async (fontName: string, fontUrl: string) => {
  await TextMeasurementWorker.invoke('TextMeasurement.ensureFont', fontName, fontUrl)
}
