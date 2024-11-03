export const updateWidget = (editor: any, widgetId: number, newState: any): any => {
  // TODO avoid closure
  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const childIndex = editor.widgets.findIndex(isWidget)
  // TODO scroll up/down if necessary
  const childWidget = editor.widgets[childIndex]
  const newWidget = {
    ...childWidget,
    oldState: childWidget.newState,
    newState,
  }
  const newWidgets = [...editor.widgets.slice(0, childIndex), newWidget, ...editor.widgets.slice(childIndex + 1)]
  return {
    ...editor,
    widgets: newWidgets,
  }
}
