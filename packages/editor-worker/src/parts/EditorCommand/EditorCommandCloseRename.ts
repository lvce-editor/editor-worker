import { WidgetId } from '@lvce-editor/constants'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as RenameWorker from '../RenameWorker/RenameWorker.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

// TODO duplicate code
const isRenameWidget = (widget: any) => {
  return widget.id === WidgetId.Rename
}

export const closeRename = async (editor: any) => {
  const { uid, widgets } = editor
  const widgetRevision = WidgetRevision.next(uid)
  const renameWidgetIndex = widgets.findIndex(isRenameWidget)
  if (renameWidgetIndex === -1) {
    return editor
  }
  const renameWidget = widgets[renameWidgetIndex]
  await RenameWorker.invoke('Rename.close', renameWidget.newState.uid)
  const latest = Editors.get(uid)
  const { newState } = latest
  return {
    ...newState,
    widgetRevision: Math.max(newState.widgetRevision || 0, widgetRevision),
  }
}
