import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const accept = (editor: any): any => {
  const { widgets } = editor
  const newWidgets = RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Rename)
  // TODO
  // 1. ask extension host for rename edits
  // 2. apply rename edit across editor (and whole workspace)
  // 3. close rename widget
  return {
    ...editor,
    focused: true,
    widgets: newWidgets,
  }
}
