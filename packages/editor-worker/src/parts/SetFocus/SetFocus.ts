import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const setFocus = async (focusKey: number) => {
  if (!focusKey) {
    return
  }
  await RendererWorker.invoke('Focus.setFocus', focusKey)
}

export const unsetAdditionalFocus = async (focusKey: number) => {
  if (!focusKey) {
    return
  }
  await RendererWorker.invoke('Focus.removeAdditionalFocus', focusKey)
}
