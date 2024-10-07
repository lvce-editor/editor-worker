import type { CompletionDetailState } from '../CompletionState/CompletionState.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const isCompletionDetail = (widget: any) => {
  return widget.id === WidgetId.CompletionDetail
}

export const getCompletionDetailState = (editor: any): CompletionDetailState | undefined => {
  const { widgets } = editor
  const child = widgets.find(isCompletionDetail)
  if (!child) {
    return undefined
  }
  return child.newState
}
