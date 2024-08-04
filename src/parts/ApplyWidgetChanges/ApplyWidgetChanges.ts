import * as ApplyWidgetChange from '../ApplyWidgetChange/ApplyWidgetChange.ts'

export const applyWidgetChanges = (editor: any, changes: any) => {
  const widgets = editor.widgets || []
  if (widgets.length === 0) {
    return widgets
  }
  const newWidgets = widgets.map((widget: any) => {
    const newWidget = ApplyWidgetChange.applyWidgetChange(editor, widget, changes)
    return newWidget
  })
  return newWidgets
}
