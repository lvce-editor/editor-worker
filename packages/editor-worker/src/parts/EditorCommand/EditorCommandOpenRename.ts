import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import type { RenameState } from '../RenameState/RenameState.ts'
import * as RenameWidgetFactory from '../RenameWidgetFactory/RenameWidgetFactory.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openRename = async (editor: any) => {
  const newStateGenerator = async (state: RenameState): Promise<RenameState> => {
    // TODO query if can rename from extension host
    const { x, y } = GetPositionAtCursor.getPositionAtCursor(editor)

    const latestState: RenameState = {
      ...state,
      x,
      y,
      width: 200,
      height: 30,
    }
    return latestState
  }
  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Rename, FocusKey.Rename, editor, RenameWidgetFactory.create, newStateGenerator, fullFocus)
}
