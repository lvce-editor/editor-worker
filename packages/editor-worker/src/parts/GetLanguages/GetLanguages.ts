import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getLanguages = async (platform: number, assetDir: string): Promise<readonly any[]> => {
  const languages = await ExtensionManagementWorker.invoke('Languages.getLanguages', platform, assetDir)
  return languages
}
