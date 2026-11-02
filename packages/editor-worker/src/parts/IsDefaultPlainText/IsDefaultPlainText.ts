import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'

export const isDefaultPlainText = (editor: any): boolean => {
  const tokenizePath = TokenizerState.getTokenizePath(editor.languageId)
  // The bundled plaintext extension has the same state-free Text token as the
  // fallback. Only its exact application asset URI may bypass the worker.
  const builtinPath = editor.assetDir ? `${editor.assetDir}/extensions/builtin.language-basics-plaintext/src/tokenizePlaintext.js` : undefined
  return (
    editor.languageId === 'plaintext' && (!tokenizePath || tokenizePath === builtinPath) && TokenizerMap.get(editor.tokenizerId) === TokenizePlainText
  )
}
