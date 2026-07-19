import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

export const setLanguageId = async (editor: any, languageId: string, tokenizePath: string) => {
  await Tokenizer.loadTokenizer(languageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const tokenizerId = editor.tokenizerId + 1
  TokenizerMap.set(tokenizerId, tokenizer)
  try {
    await RendererWorker.invoke('LocalStorage.setJson', `editor.language-mode:${editor.uri}`, languageId)
  } catch {}

  return {
    ...editor,
    focused: true,
    invalidStartIndex: 0,
    languageId,
    tokenizerId,
  }
}
