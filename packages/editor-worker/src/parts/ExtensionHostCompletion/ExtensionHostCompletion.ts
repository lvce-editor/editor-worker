import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const combineResults = (results: any) => {
  return results[0] ?? []
}

const getTextDocument = (editor: any) => {
  return {
    documentId: editor.id || editor.uid,
    languageId: editor.languageId,
    text: TextDocument.getText(editor),
    uri: editor.uri,
  }
}

const executeIsolatedCompletionProvider = async (editor: any, offset: number) => {
  const textDocument = getTextDocument(editor)
  return ExtensionManagementWorker.invoke('Extensions.executeCompletionProvider', textDocument, offset)
}

export const executeCompletionProvider = async (editor: any, offset: number) => {
  const isolatedCompletions = await executeIsolatedCompletionProvider(editor, offset)
  if (isolatedCompletions.length > 0) {
    return isolatedCompletions
  }
  return ExtensionHostEditor.execute({
    args: [offset],
    combineResults,
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: ExtensionHostCommandType.CompletionExecute,
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
  })
}

const combineResultsResolve = (items: any) => {
  return items[0] ?? undefined
}

const executeIsolatedResolveCompletionItemProvider = async (editor: any, offset: number, name: string, completionItem: any) => {
  const textDocument = getTextDocument(editor)
  return ExtensionManagementWorker.invoke('Extensions.executeResolveCompletionItemProvider', textDocument, offset, name, completionItem)
}

export const executeResolveCompletionItem = async (editor: any, offset: any, name: any, completionItem: any) => {
  const isolatedCompletionItem = await executeIsolatedResolveCompletionItemProvider(editor, offset, name, completionItem)
  if (isolatedCompletionItem) {
    return isolatedCompletionItem
  }
  return ExtensionHostEditor.execute({
    args: [offset, name, completionItem],
    combineResults: combineResultsResolve,
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: ExtensionHostCommandType.CompletionResolveExecute,
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
  })
}
