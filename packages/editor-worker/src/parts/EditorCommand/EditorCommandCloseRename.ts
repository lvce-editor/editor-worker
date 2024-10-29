import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'

// TODO duplicate code
const isRenameWidget = (widget: any) => {
  return widget.id === WidgetId.Rename
}

export const closeRename = (editor: any) => {
  const { widgets } = editor
  const renameWidgetIndex = widgets.findIndex(isRenameWidget)
  if (renameWidgetIndex === -1) {
    return editor
  }
  const newWidgets = RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Rename)
  return {
    ...editor,
    focused: true,
    widgets: newWidgets,
  }
}
