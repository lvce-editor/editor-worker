import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const combineResults = (results: any) => {
  return results[0]
}

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
  const isolatedDiagnostics = await executeIsolatedDiagnosticProvider(editor)
  if (isolatedDiagnostics.length > 0) {
    return isolatedDiagnostics
  }
  const { assetDir, platform } = editor
  return ExtensionHostEditor.execute({
    args: [],
    assetDir,
    combineResults,
    editor,
    event: ExtensionHostActivationEvent.OnDiagnostic,
    method: 'ExtensionHost.executeDiagnosticProvider',
    noProviderFoundMessage: 'no diagnostic provider found',
    noProviderResult: [],
    platform,
  })
}
