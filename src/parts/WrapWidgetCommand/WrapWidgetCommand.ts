export const wrapWidgetCommand = (widgetId: string, fn: any) => {
  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const wrapped = async (editor: any, ...args: any[]) => {
    const childIndex = editor.widgets.findIndex(isWidget)
    // TODO scroll up/down if necessary
    const childWidget = editor.widgets[childIndex]
    const newState = await fn(childWidget.newState, ...args)
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
  return wrapped
}
