import { RendererWorker } from '@lvce-editor/rpc-registry'

export const setAdditionalFocus = async (focusKey: number) => {
  // @ts-ignore
  await RendererWorker.invoke('Focus.setAdditionalFocus', focusKey)
}
