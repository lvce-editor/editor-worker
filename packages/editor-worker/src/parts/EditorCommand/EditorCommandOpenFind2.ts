import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FindWidgetFactory from '../FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'
import * as GetFindWidgetPosition from '../GetFindWidgetPosition/GetFindWidgetPosition.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openFind2 = async (editor: any) => {
  const newStateGenerator = async (state: FindWidgetState): Promise<FindWidgetState> => {
    const { value, matches, matchCount, matchIndex } = await FindWidgetFunctions.loadContent(editor.uid)
    const { x, y, width, height } = GetFindWidgetPosition.getFindWidgetPosition(editor)
    const latestState: FindWidgetState = {
      ...state,
      value,
      matches,
      matchCount,
      matchIndex,
      x,
      y,
      width,
      height,
      editorUid: editor.uid || editor.id,
      focusSource: FocusSource.Script,
      focus: FocusKey.FindWidget,
    }
    return latestState
  }
  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Find, FocusKey.FindWidget, editor, FindWidgetFactory.create, newStateGenerator, fullFocus)
}
