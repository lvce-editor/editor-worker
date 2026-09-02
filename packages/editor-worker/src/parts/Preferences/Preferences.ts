import { RendererWorker } from '@lvce-editor/rpc-registry'

export const get = async (key: string): Promise<any> => {
  const value = await RendererWorker.getPreference(key)
  return value
}

export const update = async (settings: Record<string, unknown>): Promise<void> => {
  await RendererWorker.invoke('Preferences.update', settings)
}
