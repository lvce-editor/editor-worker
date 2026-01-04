import { RendererWorker } from '@lvce-editor/rpc-registry'

// TODO add tests for this
export const activateByEvent = async (event: string, assetDir: string, platform: number): Promise<void> => {
  await RendererWorker.invoke('ExtensionHostManagement.activateByEvent', event, assetDir, platform)
}
