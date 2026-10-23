import * as Assert from '@lvce-editor/assert'
import * as ApplicationExtensionRpc from '../ApplicationExtensionRpc/ApplicationExtensionRpc.ts'

export const getLanguages = async (platform: number, assetDir: string, applicationId?: string): Promise<readonly any[]> => {
  Assert.number(platform)
  Assert.string(assetDir)
  return ApplicationExtensionRpc.invoke(applicationId, 'Extensions.getLanguages', platform, assetDir)
}
