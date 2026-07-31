import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
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
  return ExtensionManagementWorker.invoke('Extensions.executeDiagnosticProvider', textDocument)
}

export const executeDiagnosticProvider = async (editor: any): Promise<readonly Diagnostic[]> => {
  return executeIsolatedDiagnosticProvider(editor)
}
