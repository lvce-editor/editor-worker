import { OpenerWorker } from '@lvce-editor/rpc-registry'

export const openExternal = async (url: string, platform: number) => {
  // @ts-ignore
  await OpenerWorker.invoke('Open.openUrl', url, platform)
}
