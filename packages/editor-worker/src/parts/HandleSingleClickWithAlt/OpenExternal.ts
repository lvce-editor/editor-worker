import { OpenerWorker } from '@lvce-editor/rpc-registry'

export const openExternal = async (url: string, platform: number) => {
  await OpenerWorker.openUrl(url, platform)
}
