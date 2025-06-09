import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const setAdditionalFocus = async (focusKey: number) => {
  // @ts-ignore
  await RendererWorker.invoke('Focus.setAdditionalFocus', focusKey)
}
