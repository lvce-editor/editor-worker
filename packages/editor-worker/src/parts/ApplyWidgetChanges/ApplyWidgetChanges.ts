import * as ApplyWidgetChange from '../ApplyWidgetChange/ApplyWidgetChange.ts'

export const applyWidgetChanges = async (editor: any, changes: any) => {
  const widgets = editor.widgets || []
  if (widgets.length === 0) {
    return widgets
  }
  const newWidgets = []
  for (const widget of widgets) {
    const newWidget = await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)
    if (newWidget.newState) {
      newWidgets.push(newWidget)
    }
  }
  return newWidgets
}
