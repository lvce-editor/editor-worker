import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

export const getLanguages = async (): Promise<readonly any[]> => {
  // @ts-ignore
  const languages = await ExtensionHostWorker.invoke('Languages.getLanguages')
  return languages
}
