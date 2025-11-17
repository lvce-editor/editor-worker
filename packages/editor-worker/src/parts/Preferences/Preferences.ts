import { RendererWorker } from '@lvce-editor/rpc-registry'

export const get = async (key: string): Promise<any> => {
  const value = await RendererWorker.invoke('Preferences.get', key)
  return value
}
