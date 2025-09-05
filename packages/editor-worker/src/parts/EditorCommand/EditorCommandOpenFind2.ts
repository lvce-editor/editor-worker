import { WidgetId } from '@lvce-editor/constants'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FindWidgetFactory from '../FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'

const newStateGenerator = (state: FindWidgetState, parentUid: number): Promise<FindWidgetState> => {
  return FindWidgetFunctions.loadContent(state, parentUid)
}

export const openFind2 = async (editor: any) => {
  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Find, FocusKey.FindWidget, editor, FindWidgetFactory.create, newStateGenerator, fullFocus)
}
