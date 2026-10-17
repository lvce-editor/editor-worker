import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'

export const loadTokenizers = async (languageIds: any) => {
  for (const languageId of languageIds) {
    const tokenizePath = TokenizerState.getTokenizePath(languageId)
    await Tokenizer.loadTokenizer(languageId, tokenizePath)
  }
}
