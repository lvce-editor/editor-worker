import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const get = async (key: string, applicationId?: string): Promise<any> => {
  const value =
    applicationId === undefined ? await RendererWorker.getPreference(key) : await ApplicationRpc.invoke(applicationId, 'Preferences.get', key)
  return value
}

export const update = async (settings: Record<string, unknown>): Promise<void> => {
  await RendererWorker.invoke('Preferences.update', settings)
}
