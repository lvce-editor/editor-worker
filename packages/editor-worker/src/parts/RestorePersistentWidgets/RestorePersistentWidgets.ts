import { WidgetId } from '@lvce-editor/constants'
import type { EditorState } from '../State/State.ts'
import { openFind2 } from '../EditorCommand/EditorCommandOpenFind2.ts'

interface SavedWidgetState {
  readonly id: number
  readonly state: unknown
}

export const restorePersistentWidgets = async (editor: EditorState, savedWidgets: unknown): Promise<EditorState> => {
  if (!Array.isArray(savedWidgets)) {
    return editor
  }
  const savedFindWidget = savedWidgets.find((widget: SavedWidgetState) => widget?.id === WidgetId.Find)
  if (!savedFindWidget) {
    return editor
  }
  return openFind2(editor, savedFindWidget.state)
}
