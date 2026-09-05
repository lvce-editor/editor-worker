import type { SignatureHelpResult } from '../SignatureHelpResult/SignatureHelpResult.ts'
import * as ApplicationExtensionRpc from '../ApplicationExtensionRpc/ApplicationExtensionRpc.ts'
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

export const executeSignatureHelpProvider = async (editor: any, offset: number): Promise<SignatureHelpResult | undefined> => {
  Assert.object(editor)
  Assert.number(offset)
  const textDocument = getTextDocument(editor)
  return ApplicationExtensionRpc.invoke(editor.applicationId, 'Extensions.executeSignatureHelpProvider', textDocument, offset)
}
