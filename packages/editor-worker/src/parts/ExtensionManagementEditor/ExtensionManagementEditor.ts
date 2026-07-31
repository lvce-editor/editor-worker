import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const getTextDocument = (editor: any) => ({
  documentId: editor.id || editor.uid,
  languageId: editor.languageId,
  text: TextDocument.getText(editor),
  uri: editor.uri,
})

export const execute = async ({ args, editor, kind, method, noProviderFoundResult = undefined }: any) => {
  const textDocument = getTextDocument(editor)
  const result = await ExtensionManagementWorker.invoke('Extensions.executeLanguageProvider', kind, method, textDocument, ...args)
  if (!result.found) {
    return noProviderFoundResult
  }
  return result.result
}
