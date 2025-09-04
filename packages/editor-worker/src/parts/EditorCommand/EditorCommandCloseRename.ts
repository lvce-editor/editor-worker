import * as Editors from '../Editors/Editors.ts'
import * as RenameWorker from '../RenameWorker/RenameWorker.ts'
import { WidgetId } from '@lvce-editor/constants'

// TODO duplicate code
const isRenameWidget = (widget: any) => {
  return widget.id === WidgetId.Rename
}

export const closeRename = async (editor: any) => {
  const { widgets, uid } = editor
  const renameWidgetIndex = widgets.findIndex(isRenameWidget)
  if (renameWidgetIndex === -1) {
    return editor
  }
  const renameWidget = widgets[renameWidgetIndex]
  await RenameWorker.invoke('Rename.close', renameWidget.newState.uid)
  const latest = Editors.get(uid)
  const { newState } = latest
  return newState
}
