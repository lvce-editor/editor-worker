import * as GetLanguages from '../GetLanguages/GetLanguages.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'

const warnedLanguageIds = new Set<string>()

const getEmbeddedTokenizerPath = async (editor: any, languageId: string): Promise<string> => {
  switch (languageId) {
    case 'css':
    case 'javascript':
      break
    default:
      return ''
  }
  const languages = await GetLanguages.getLanguages(editor.platform, editor.assetDir)
  for (const language of languages) {
    if (language?.id === languageId) {
      return language.tokenize || ''
    }
  }
  return ''
}

const warnMissingTokenizerPath = (languageId: string) => {
  if (warnedLanguageIds.has(languageId)) {
    return
  }
  warnedLanguageIds.add(languageId)
  console.warn(`No embedded tokenizer path found for language "${languageId}"`)
}

export const loadTokenizers = async (editor: any, languageIds: any) => {
  for (const languageId of languageIds) {
    const tokenizePath = await getEmbeddedTokenizerPath(editor, languageId)
    if (!tokenizePath) {
      warnMissingTokenizerPath(languageId)
      continue
    }
    await Tokenizer.loadTokenizer(languageId, tokenizePath)
  }
}
