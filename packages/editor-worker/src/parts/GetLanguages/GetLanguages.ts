import * as Assert from '@lvce-editor/assert'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getLanguages = async (platform: number, assetDir: string): Promise<readonly any[]> => {
  Assert.number(platform)
  Assert.string(assetDir)
  const languages = await ExtensionManagementWorker.invoke('Extensions.getLanguages', platform, assetDir)
  return languages
}
