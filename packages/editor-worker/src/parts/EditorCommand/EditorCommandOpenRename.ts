import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetRenamePosition from '../GetRenamePosition/GetRenamePosition.ts'
import type { RenameState } from '../RenameState/RenameState.ts'
import * as RenameWidgetFactory from '../RenameWidgetFactory/RenameWidgetFactory.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openRename = async (editor: any) => {
  const newStateGenerator = async (state: RenameState): Promise<RenameState> => {
    // TODO query if can rename from extension host
    const { x, y, width, height } = GetRenamePosition.getRenamePosition(editor)

    const latestState: RenameState = {
      ...state,
      x,
      y,
      width,
      height,
    }
    return latestState
  }
  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Rename, FocusKey.Rename, editor, RenameWidgetFactory.create, newStateGenerator, fullFocus)
}
