import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as LoadSourceActions from '../LoadSourceActions/LoadSourceActions.ts'
import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'
import * as SourceActionWidgetFactory from '../SourceActionWidgetFactory/SourceActionWidgetFactory.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const showSourceActions = async (editor: any) => {
  const newStateGenerator = (state: SourceActionState): Promise<SourceActionState> => {
    return LoadSourceActions.loadSourceActions(editor, state)
  }
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.SourceAction,
    FocusKey.SourceActions,
    editor,
    SourceActionWidgetFactory.create,
    newStateGenerator,
  )
}
