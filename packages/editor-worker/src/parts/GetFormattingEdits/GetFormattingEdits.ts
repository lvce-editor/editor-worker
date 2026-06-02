import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getFormattingEdits = async (editor: any): Promise<readonly any[]> => {
  const textDocument = {
    documentId: editor.id || editor.uid,
    languageId: editor.languageId,
    text: TextDocument.getText(editor),
    uri: editor.uri,
  }
  return ExtensionManagementWorker.invoke('Extensions.executeFormattingProvider', textDocument)
}
