import type { CompletionState } from '../CompletionState/CompletionState.ts'
import * as GetWidgetState from '../GetWidgetState/GetWidgetState.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const getCompletionState = (editor: any): CompletionState | undefined => {
  return GetWidgetState.getWidgetState(editor, WidgetId.Completion)
}
