import * as RenameWorker from '../RenameWorker/RenameWorker.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

// TODO duplicate code
const isRenameWidget = (widget: any) => {
  return widget.id === WidgetId.Rename
}

export const closeRename = async (editor: any) => {
  const { widgets } = editor
  const renameWidgetIndex = widgets.findIndex(isRenameWidget)
  if (renameWidgetIndex === -1) {
    return editor
  }
  const renameWidget = widgets[renameWidgetIndex]
  await RenameWorker.invoke('Rename.close', renameWidget.newState.uid)
  return editor
}
