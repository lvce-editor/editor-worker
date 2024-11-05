import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

const combineResults = (results: any) => {
  return results[0] ?? []
}

export const executeCompletionProvider = async (editor: any, offset: number) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: ExtensionHostCommandType.CompletionExecute,
    args: [offset],
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
    combineResults,
  })
}

const combineResultsResolve = (items: any) => {
  return items[0] ?? undefined
}

export const executeResolveCompletionItem = async (editor: any, offset: any, name: any, completionItem: any) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnCompletion,
    method: ExtensionHostCommandType.CompletionResolveExecute,
    args: [offset, name, completionItem],
    noProviderFoundMessage: 'no completion provider found',
    noProviderFoundResult: [],
    combineResults: combineResultsResolve,
  })
}
