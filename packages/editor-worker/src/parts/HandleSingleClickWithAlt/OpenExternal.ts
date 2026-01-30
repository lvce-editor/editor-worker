import { OpenerWorker } from '@lvce-editor/rpc-registry'

export const openExternal = async (url: string) => {
  await OpenerWorker.openUrl(url)
}
