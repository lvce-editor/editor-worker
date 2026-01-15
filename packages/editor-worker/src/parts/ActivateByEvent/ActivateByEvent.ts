import * as Assert from '@lvce-editor/assert'
import { RendererWorker } from '@lvce-editor/rpc-registry'

// TODO add tests for this
export const activateByEvent = async (event: string, assetDir: string, platform: number): Promise<void> => {
  Assert.string(event)
  // Assert.string(assetDir)
  // Assert.number(platform)
  await RendererWorker.invoke('ExtensionHostManagement.activateByEvent', event, assetDir, platform)
}
