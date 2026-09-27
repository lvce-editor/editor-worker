import type { TabCompletionResult } from '../TabCompletionResult/TabCompletionResult.ts'
import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'

export const executeTabCompletionProvider = async (editor: any, offset: number): Promise<TabCompletionResult | undefined> => {
  return ExtensionManagementEditor.execute({
    args: [offset],
    editor,
    kind: 'tab completion',
    method: 'provideTabCompletion',
    noProviderFoundResult: undefined,
  })
}
