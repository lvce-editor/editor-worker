import { WidgetId } from '@lvce-editor/constants'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as RenameWorker from '../RenameWorker/RenameWorker.ts'

const hasRenameWidget = (editor: any): boolean => {
  return (editor?.widgets || []).some((widget: any) => widget.id === WidgetId.Rename)
}

const hasRenameWidgetInAnotherEditor = (editorUid: number | undefined): boolean => {
  return Editors.getKeys().some((key) => {
    const uid = Number(key)
    if (uid === editorUid) {
      return false
    }
    const editor = Editors.get(uid)?.newState
    return hasRenameWidget(editor)
  })
}

export const disposeRenameWorker = async (): Promise<void> => {
  await RenameWorker.dispose()
}

export const disposeRenameWorkerIfUnused = async (): Promise<void> => {
  if (!hasRenameWidgetInAnotherEditor(undefined)) {
    await disposeRenameWorker()
  }
}

export const disposeRenameWorkerIfNeeded = async (oldEditor: any, newEditor: any): Promise<void> => {
  if (hasRenameWidget(oldEditor) && !hasRenameWidget(newEditor)) {
    await disposeRenameWorkerIfUnused()
  }
}
