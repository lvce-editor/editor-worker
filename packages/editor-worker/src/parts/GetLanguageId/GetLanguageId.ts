// TODO merge all of this with extension host languages module

import * as Assert from '../Assert/Assert.ts'
import * as GetFileExtension from '../GetFileExtension/GetFileExtension.ts'

const getLanguageByExtension = (languages: readonly any[], extensionLower: string) => {
  for (const language of languages) {
    if (language && language.extensions && Array.isArray(language.extensions) && language.extensions.includes(extensionLower)) {
      return language.id
    }
  }
  return ''
}

const getLanguageByFileName = (languages: readonly any[], fileNameLower: string): string => {
  for (const language of languages) {
    if (language && language.fileNames && Array.isArray(language.fileNames) && language.fileNames.includes(fileNameLower)) {
      return language.id
    }
  }
  return ''
}

export const getLanguageId = (uri: string, languages: readonly any[]): string => {
  Assert.string(uri)
  // TODO this is inefficient for icon theme, as file extension is computed twice
  // maybe icon theme should get a slimmed down version of languages so that it can internally compute
  // the language id
  const extensionIndex = GetFileExtension.getFileExtensionIndex(uri)
  const extension = uri.slice(extensionIndex)
  const extensionLower = extension.toLowerCase()
  const candidate1 = getLanguageByExtension(languages, extensionLower)
  if (candidate1) {
    return candidate1
  }
  const fileNameLower = uri.toLowerCase()
  const secondExtensionIndex = GetFileExtension.getNthFileExtension(uri, extensionIndex - 1)
  const secondExtension = uri.slice(secondExtensionIndex)
  const candidate2 = getLanguageByExtension(languages, secondExtension)
  if (candidate2) {
    return candidate2
  }
  const candidate3 = getLanguageByFileName(languages, fileNameLower)
  if (candidate3) {
    return candidate3
  }
  return 'unknown'
}
