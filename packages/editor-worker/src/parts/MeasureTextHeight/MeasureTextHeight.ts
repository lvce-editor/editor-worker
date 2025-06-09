import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

// TODO ask renderer process directly
export const measureTextHeight = async (text: string, fontFamily: string, fontSize: number): Promise<number> => {
  // @ts-ignore
  return RendererWorker.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}

export const measureTextBlockHeight = async (
  text: string,
  fontFamily: string,
  fontSize: number,
  lineHeight: number | string,
  width: number,
): Promise<number> => {
  // @ts-ignore
  // return RendererProcess.invoke('MeasureTextBlockHeight.measureTextBlockHeight', text, fontSize, fontFamily, lineHeight, width)
  return 100
}
