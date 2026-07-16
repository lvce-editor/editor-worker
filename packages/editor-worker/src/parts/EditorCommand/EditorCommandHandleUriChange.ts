import type { EditorState } from '../State/State.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const handleUriChange = async (editor: EditorState, newUri: string): Promise<EditorState> => {
  const content = TextDocument.getText(editor)
  await ExtensionHostWorker.invoke(ExtensionHostCommandType.TextDocumentSyncFull, newUri, editor.id, editor.languageId, content)
  return {
    ...editor,
    uri: newUri,
  }
}
