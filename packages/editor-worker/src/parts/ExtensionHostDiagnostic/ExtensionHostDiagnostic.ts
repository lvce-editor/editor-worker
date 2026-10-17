import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as ApplicationExtensionRpc from '../ApplicationExtensionRpc/ApplicationExtensionRpc.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const getTextDocument = (editor: any) => {
  return {
    documentId: editor.id || editor.uid,
    languageId: editor.languageId,
    text: TextDocument.getText(editor),
    uri: editor.uri,
  }
}

const executeIsolatedDiagnosticProvider = async (editor: any): Promise<readonly Diagnostic[]> => {
  const textDocument = getTextDocument(editor)
  return ApplicationExtensionRpc.invoke(editor.applicationId, 'Extensions.executeDiagnosticProvider', textDocument)
}

const streamIsolatedDiagnosticProvider = async (editor: any, resultPort: MessagePort): Promise<unknown> => {
  const textDocument = getTextDocument(editor)
  return ApplicationExtensionRpc.invokeAndTransfer(editor.applicationId, 'Extensions.streamDiagnosticProvider', textDocument, resultPort)
}

export const executeDiagnosticProvider = async (editor: any): Promise<readonly Diagnostic[]> => {
  return executeIsolatedDiagnosticProvider(editor)
}

export const streamDiagnosticProvider = async (editor: any, resultPort: MessagePort): Promise<unknown> => {
  return streamIsolatedDiagnosticProvider(editor, resultPort)
}
