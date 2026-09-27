import * as ApplyWidgetChange from '../ApplyWidgetChange/ApplyWidgetChange.ts'

export const applyWidgetChanges = async (editor: any, changes: any) => {
  const widgets = editor.widgets || []
  if (widgets.length === 0) {
    return editor
  }
  let latestEditor = editor
  for (const widget of widgets) {
    latestEditor = await ApplyWidgetChange.applyWidgetChange(latestEditor, widget, changes)
  }
  return latestEditor
}
