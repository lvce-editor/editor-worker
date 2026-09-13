import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

export const setLanguageId = async (editor: any, languageId: string, tokenizePath: string) => {
  await Tokenizer.loadTokenizer(languageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const newTokenizerId = TokenizerMap.register(tokenizer)

  return {
    ...editor,
    focused: true,
    invalidStartIndex: 0,
    languageId,
    tokenizerId: newTokenizerId,
  }
}
