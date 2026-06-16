import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'
import * as TokenMaps from '../TokenMaps/TokenMaps.ts'

const loadTokenizerLocal = async (languageId: string, tokenizePath: string) => {
  if (!tokenizePath) {
    return
  }
  try {
    const tokenizer = await import(tokenizePath)
    if (typeof tokenizer.tokenizeLine !== 'function') {
      console.warn(`tokenizer.tokenizeLine should be a function in "${tokenizePath}"`)
      return
    }
    if (!tokenizer.TokenMap || typeof tokenizer.TokenMap !== 'object' || Array.isArray(tokenizer.TokenMap)) {
      console.warn(`tokenizer.TokenMap should be an object in "${tokenizePath}"`)
      return
    }
    TokenMaps.set(languageId, tokenizer.TokenMap)
    TokenizerState.set(languageId, tokenizer)
  } catch (error) {
    console.error(error)
  }
}

// TODO loadTokenizer should be invoked from renderer worker
export const loadTokenizer = async (languageId: string, tokenizePath: string) => {
  if (!tokenizePath) {
    return
  }
  if (SyntaxHighlightingState.getEnabled()) {
    try {
      // @ts-ignore
      const tokenMap = await SyntaxHighlightingWorker.invoke('Tokenizer.load', languageId, tokenizePath)
      TokenMaps.set(languageId, tokenMap)
    } catch (error) {
      console.warn(`Failed to load tokenizer in syntax worker for "${languageId}"`)
      console.error(error)
    }
  }
  await loadTokenizerLocal(languageId, tokenizePath)
}

export const getTokenizer = (languageId: any) => {
  if (TokenizerState.has(languageId)) {
    return TokenizerState.get(languageId)
  }
  if (TokenizerState.isPending(languageId)) {
    return TokenizePlainText
  }
  return TokenizePlainText
}
