import * as FindWidgetFactory from '../FindWidgetFactory/FindWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as SetAdditionalFocus from '../SetAdditionalFocus/SetAdditionalFocus.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'

export const openFind2 = async (editor: any) => {
  const newStateGenerator = async (state: FindWidgetState): Promise<FindWidgetState> => {
    const { value, matches, matchCount, matchIndex } = await FindWidgetFunctions.loadContent(editor.uid)

    const latestState: FindWidgetState = {
      ...state,
      value,
      matches,
      matchCount,
      matchIndex,
    }
    return latestState
  }
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Find, FocusKey.FindWidget, editor, FindWidgetFactory.create, newStateGenerator)
}
