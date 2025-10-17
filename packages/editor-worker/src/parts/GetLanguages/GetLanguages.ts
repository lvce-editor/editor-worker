import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

const getExtensionLanguages = (extension: any): readonly any[] => {
  if (!extension) {
    return []
  }
  if (!extension.languages || !Array.isArray(extension.languages)) {
    return []
  }
  return extension.languages.map((language: any) => {
    return {
      ...language,
      uri: extension.uri,
    }
  })
}

export const getLanguages = async (): Promise<readonly any[]> => {
  const extensions = await ExtensionHostWorker.invoke('Extensions.getExtensions')
  const languages = extensions.flatMap(getExtensionLanguages)
  return languages
}
