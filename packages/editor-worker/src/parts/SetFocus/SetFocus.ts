import { RendererWorker } from '@lvce-editor/rpc-registry'

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
  // @ts-ignore
  await RendererWorker.invoke('Focus.removeAdditionalFocus', focusKey)
}
