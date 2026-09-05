import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import * as ApplicationExtensionRpc from '../ApplicationExtensionRpc/ApplicationExtensionRpc.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getOrganizeImportEdits = async (editor: any): Promise<readonly OffsetBasedEdit[]> => {
  const textDocument = {
    documentId: editor.id || editor.uid,
    languageId: editor.languageId,
    text: TextDocument.getText(editor),
    uri: editor.uri,
  }
  const result = await ApplicationExtensionRpc.invoke(editor.applicationId, 'Extensions.executeOrganizeImportsProvider', textDocument)
  return result.found ? (result.result ?? []) : []
}
