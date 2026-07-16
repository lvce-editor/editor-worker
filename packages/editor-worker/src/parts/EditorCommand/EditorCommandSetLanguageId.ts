import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

export const setLanguageId = async (editor: any, languageId: string, tokenizePath: string) => {
  const { tokenizerId } = editor
  await Tokenizer.loadTokenizer(languageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const newTokenizerId = tokenizerId + 1
  TokenizerMap.set(newTokenizerId, tokenizer)

  return {
    ...editor,
    focused: true,
    invalidStartIndex: 0,
    languageId,
    tokenizerId: newTokenizerId,
  }
}
