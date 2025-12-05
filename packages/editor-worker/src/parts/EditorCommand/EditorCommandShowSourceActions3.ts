import { WidgetId } from '@lvce-editor/constants'
import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as Editors from '../Editors/Editors.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as SourceActionWidgetFactory from '../SourceActionWidgetFactory/SourceActionWidgetFactory.ts'
import * as SourceActionWorker from '../SourceActionWorker/SourceActionWorker.ts'

const newStateGenerator = async (state: SourceActionState, parentUid: number): Promise<SourceActionState> => {
  const { height, uid, width, x, y } = state
  const { newState } = Editors.get(parentUid)
  const { languageId } = newState
  await SourceActionWorker.invoke('SourceActions.create', uid, x, y, width, height, parentUid, languageId)
  await SourceActionWorker.invoke('SourceActions.loadContent', uid)
  const diff = await SourceActionWorker.invoke('SourceActions.diff2', uid)
  const commands = await SourceActionWorker.invoke('SourceActions.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}

export const showSourceActions = async (editor: any) => {
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.SourceAction,
    FocusKey.SourceActions,
    editor,
    SourceActionWidgetFactory.create,
    newStateGenerator,
  )
}
