import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { EditorState } from '../State/State.ts'
import { getEditorStatus } from '../GetEditorStatus/GetEditorStatus.ts'
import * as ListenerType from '../ListenerType/ListenerType.ts'
import * as NotifyListeners from '../NotifyListeners/NotifyListeners.ts'

const equals = (oldStatus: EditorStatus, newStatus: EditorStatus): boolean => {
  return (
    oldStatus.column === newStatus.column &&
    oldStatus.encoding === newStatus.encoding &&
    oldStatus.languageId === newStatus.languageId &&
    oldStatus.line === newStatus.line &&
    oldStatus.tabSize === newStatus.tabSize
  )
}

export const notifyEditorStatusChange = async (oldEditor: EditorState, newEditor: EditorState): Promise<void> => {
  if (newEditor.initial || !newEditor.focused) {
    return
  }
  const newStatus = getEditorStatus(newEditor)
  if (!oldEditor.initial && oldEditor.focused && equals(getEditorStatus(oldEditor), newStatus)) {
    return
  }
  await NotifyListeners.notifyListeners(ListenerType.EditorSelection, 'StatusBar.handleEditorStatusChanged', newStatus)
}

export const notifyEditorStatusCleared = async (): Promise<void> => {
  await NotifyListeners.notifyListeners(ListenerType.EditorSelection, 'StatusBar.handleEditorStatusChanged', undefined)
}
