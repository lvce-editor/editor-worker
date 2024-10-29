import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const isCompletionWidget = (widget: any) => {
  return widget.id === WidgetId.Completion
}

export const closeCompletion = (editor: any) => {
  const { widgets } = editor
  const completionWidgetIndex = widgets.findIndex(isCompletionWidget)
  if (completionWidgetIndex === -1) {
    return editor
  }
  const newWidgets = RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Completion)
  return {
    ...editor,
    widgets: newWidgets,
  }
}
