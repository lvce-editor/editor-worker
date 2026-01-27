import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openExternal = async (url: string) => {
  await RendererWorker.invoke('Open.openUrl', url)
}
