import * as WidgetId from '../WidgetId/WidgetId.ts'

const isCompletion = (widget: any) => {
  return widget.id === WidgetId.Completion
}

export const getCompletionState = (editor: any) => {
  const { widgets } = editor
  const child = widgets.find(isCompletion)
  return child.newState
}
