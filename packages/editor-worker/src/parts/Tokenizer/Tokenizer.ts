import * as BuiltinTokenizeCss from '../../../../server/node_modules/@lvce-editor/static-server/static/27c0844/extensions/builtin.language-basics-css/src/tokenizeCss.js'
import * as BuiltinTokenizeHtml from '../../../../server/node_modules/@lvce-editor/static-server/static/27c0844/extensions/builtin.language-basics-html/src/tokenizeHtml.js'
import * as BuiltinTokenizeJavaScript from '../../../../server/node_modules/@lvce-editor/static-server/static/27c0844/extensions/builtin.language-basics-javascript/src/tokenizeJavaScript.js'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'
import * as TokenMaps from '../TokenMaps/TokenMaps.ts'

const shouldLoadLocalTokenizer = (languageId: string) => {
  switch (languageId) {
    case 'html':
    case 'css':
    case 'javascript':
      return true
    default:
      return false
  }
}

const getBuiltinTokenizer = (languageId: string) => {
  switch (languageId) {
    case 'css':
      return BuiltinTokenizeCss
    case 'html':
      return BuiltinTokenizeHtml
    case 'javascript':
      return BuiltinTokenizeJavaScript
    default:
      return undefined
  }
}

const loadTokenizerLocal = async (languageId: string, tokenizePath: string) => {
  try {
    const tokenizer = getBuiltinTokenizer(languageId) || (await import(tokenizePath))
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
  if (!tokenizePath && !shouldLoadLocalTokenizer(languageId)) {
    return
  }
  if (SyntaxHighlightingState.getEnabled()) {
    if (tokenizePath) {
      // @ts-ignore
      const tokenMap = await SyntaxHighlightingWorker.invoke('Tokenizer.load', languageId, tokenizePath)
      TokenMaps.set(languageId, tokenMap)
    }
    if (shouldLoadLocalTokenizer(languageId)) {
      await loadTokenizerLocal(languageId, tokenizePath)
    }
    return
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
