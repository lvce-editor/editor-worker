import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

export const setLanguageId = async (editor: any, languageId: string, tokenizePath: string) => {
  const { tokenizerId, uri } = editor
  await Tokenizer.loadTokenizer(languageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const newTokenizerId = tokenizerId + 1
  TokenizerMap.set(newTokenizerId, tokenizer)
  try {
    await RendererWorker.invoke('LocalStorage.setJson', `editor.language-mode:${uri}`, languageId)
  } catch {}

  return {
    ...editor,
    focused: true,
    invalidStartIndex: 0,
    languageId,
    tokenizerId: newTokenizerId,
  }
}
