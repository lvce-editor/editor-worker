import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'

export const wrapWidgetCommand = (widgetId: number, fn: any) => {
  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const wrapped = async (editor: any, ...args: any[]) => {
    const childIndex = editor.widgets.findIndex(isWidget)
    // TODO scroll up/down if necessary
    const childWidget = editor.widgets[childIndex]
    const newState = await fn(childWidget.newState, ...args)
    const newEditor = UpdateWidget.updateWidget(editor, widgetId, newState)
    return newEditor
  }
  return wrapped
}
