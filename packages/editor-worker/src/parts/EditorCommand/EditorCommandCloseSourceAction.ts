import * as WidgetId from '../WidgetId/WidgetId.ts'

const isMatchingWidget = (widget: any) => {
  return widget.id === WidgetId.SourceAction
}

export const closeSourceAction = (editor: any) => {
  const { widgets } = editor
  const index = widgets.findIndex(isMatchingWidget)
  if (index === -1) {
    return editor
  }
  const newWidgets = [...widgets.slice(0, index), ...widgets.slice(index + 1)]
  return {
    ...editor,
    widgets: newWidgets,
  }
}
