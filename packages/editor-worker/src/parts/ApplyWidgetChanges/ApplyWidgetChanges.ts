import * as ApplyWidgetChange from '../ApplyWidgetChange/ApplyWidgetChange.ts'

export const applyWidgetChanges = async (editor: any, changes: any) => {
  const widgets = editor.widgets || []
  if (widgets.length === 0) {
    return widgets
  }
  let latestEditor = editor
  for (const widget of widgets) {
    latestEditor = await ApplyWidgetChange.applyWidgetChange(editor, widget, changes)
  }
  return latestEditor
}
