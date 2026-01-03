import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.ts'

export const getLanguages = async (): Promise<readonly any[]> => {
  // @ts-ignore
  const languages = await ExtensionManagementWorker.invoke('Languages.getLanguages')
  return languages
}
