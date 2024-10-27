import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'
import type { TabCompletionResult } from '../TabCompletionResult/TabCompletionResult.ts'

const combineResults = (results: any) => {
  return results[0]
}

export const executeTabCompletionProvider = (editor: any, offset: number): Promise<TabCompletionResult | undefined> => {
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
