import type { RenameState } from '../RenameState/RenameState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as GetRenamePosition from '../GetRenamePosition/GetRenamePosition.ts'
import * as RenameWidgetFactory from '../RenameWidgetFactory/RenameWidgetFactory.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as EditorCommandGetWordAt from './EditorCommandGetWordAt.ts'

export const openRename = async (editor: any) => {
  const { rowIndex, columnIndex } = GetPositionAtCursor.getPositionAtCursor(editor)
  const { word } = EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)
  if (!word) {
    return editor
  }
  const newStateGenerator = async (state: RenameState): Promise<RenameState> => {
    // TODO query if can rename from extension host
    const { x, y, width, height } = GetRenamePosition.getRenamePosition(editor)
    const latestState: RenameState = {
      ...state,
      x,
      y,
      width,
      height,
      oldValue: word,
      newValue: word,
    }
    return latestState
  }
  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.Rename,
    FocusKey.FocusEditorRename,
    editor,
    RenameWidgetFactory.create,
    newStateGenerator,
    fullFocus,
  )
}
