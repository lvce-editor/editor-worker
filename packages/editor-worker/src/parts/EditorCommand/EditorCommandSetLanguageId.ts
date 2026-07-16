import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'

export const setLanguageId = async (editor: any, languageId: string, tokenizePath: string) => {
  const { tokenizerId } = editor
  TokenizerState.setTokenizePath(languageId, tokenizePath)
  await Tokenizer.loadTokenizer(languageId, tokenizePath)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const newTokenizerId = tokenizerId + 1
  TokenizerMap.set(newTokenizerId, tokenizer)

  const latest = GetEditor.getEditor(editor.uid)
  await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSetLanguageId, latest.id, languageId)

  return {
    ...latest,
    focused: true,
    invalidStartIndex: 0,
    languageId,
    tokenizerId: newTokenizerId,
  }
}
