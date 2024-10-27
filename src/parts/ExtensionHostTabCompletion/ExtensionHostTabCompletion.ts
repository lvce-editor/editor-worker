import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

const combineResults = (results: any) => {
  return results[0]
}

export const executeTabCompletionProvider = (editor: any, offset: number) => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnTabCompletion,
    method: ExtensionHostCommandType.TabCompletionExecuteTabCompletionProvider,
    args: [offset],
    noProviderFoundMessage: 'No tab completion provider found',
    combineResults,
    noProviderFoundResult: undefined,
  })
}
