const isCompletionWidget = (widget: any) => {
  return widget.id === 'completion'
}

export const closeCompletion = (editor: any) => {
  const { widgets } = editor
  const completionWidgetIndex = widgets.findIndex(isCompletionWidget)
  if (completionWidgetIndex === -1) {
    return editor
  }
  const newWidgets = [...widgets.slice(0, completionWidgetIndex), ...widgets.slice(completionWidgetIndex + 1)]
  return {
    ...editor,
    widgets: newWidgets,
  }
}
