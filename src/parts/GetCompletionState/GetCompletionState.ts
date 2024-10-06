import type { CompletionState } from '../CompletionState/CompletionState.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const isCompletion = (widget: any) => {
  return widget.id === WidgetId.Completion
}

export const getCompletionState = (editor: any): CompletionState | undefined => {
  const { widgets } = editor
  const child = widgets.find(isCompletion)
  if (!child) {
    return undefined
  }
  return child.newState
}
