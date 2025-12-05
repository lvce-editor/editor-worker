import { WidgetId } from '@lvce-editor/constants'
import type { HoverState } from '../HoverState/HoverState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as Editors from '../Editors/Editors.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HoverWidgetFactory from '../HoverWidgetFactory/HoverWidgetFactory.ts'
import * as HoverWorker from '../HoverWorker/HoverWorker.ts'

const newStateGenerator = async (state: HoverState, parentUid: number): Promise<HoverState> => {
  const { height, uid, width, x, y } = state
  const { newState } = Editors.get(parentUid)
  const { languageId } = newState
  await HoverWorker.invoke('Hover.create', uid, x, y, width, height, parentUid, languageId)
  await HoverWorker.invoke('Hover.loadContent', uid)
  const diff = await HoverWorker.invoke('Hover.diff2', uid)
  const commands = await HoverWorker.invoke('Hover.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}

export const showHover3 = async (editor: any) => {
  const fullFocus = false
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.Hover,
    FocusKey.FocusEditorHover,
    editor,
    HoverWidgetFactory.create,
    newStateGenerator,
    fullFocus,
  )
}
