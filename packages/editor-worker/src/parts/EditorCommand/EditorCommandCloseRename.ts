import * as WidgetId from '../WidgetId/WidgetId.ts'

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
  const newWidgets = [...widgets.slice(0, renameWidgetIndex), ...widgets.slice(renameWidgetIndex + 1)]
  return {
    ...editor,
    focused: true,
    widgets: newWidgets,
  }
}
