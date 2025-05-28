import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FindWidgetFactory from '../FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const newStateGenerator = (state: FindWidgetState, parentUid: number): Promise<FindWidgetState> => {
  return FindWidgetFunctions.loadContent(state, parentUid)
}

export const openFind2 = async (editor: any) => {
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.ColorPicker, FocusKey.ColorPicker, editor, FindWidgetFactory.create, newStateGenerator)
}
