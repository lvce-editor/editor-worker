import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as Assert from '../Assert/Assert.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const getTextDocument = (editor: any) => {
  return {
    documentId: editor.id || editor.uid,
    languageId: editor.languageId,
    text: TextDocument.getText(editor),
    uri: editor.uri,
  }
}

const executeIsolatedHoverProvider = async (editor: any, offset: number) => {
  const textDocument = getTextDocument(editor)
  return ExtensionManagementWorker.invoke('Extensions.executeHoverProvider', textDocument, offset)
}

export const executeHoverProvider = async (editor: any, offset: number) => {
  Assert.object(editor)
  Assert.number(offset)
  return executeIsolatedHoverProvider(editor, offset)
}
