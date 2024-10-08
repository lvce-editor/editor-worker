import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const setAdditionalFocus = async (focusKey: number) => {
  await RendererWorker.invoke('Focus.setAdditionalFocus', focusKey)
}
