import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'

export const isDefaultPlainText = (editor: any): boolean => {
  return (
    editor.languageId === 'plaintext' &&
    !TokenizerState.getTokenizePath(editor.languageId) &&
    TokenizerMap.get(editor.tokenizerId) === TokenizePlainText
  )
}
