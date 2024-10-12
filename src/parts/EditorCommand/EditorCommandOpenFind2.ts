import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as FindWidgetFactory from '../FindWidgetFactory/FindWidgetFactory.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openFind2 = async (editor: any) => {
  const newStateGenerator = async (state: FindWidgetState): Promise<FindWidgetState> => {
    const { value, matches, matchCount, matchIndex } = await FindWidgetFunctions.loadContent(editor.uid)
    const { x, y, width, height } = FindWidgetFunctions.getPosition(editor)
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
      focus: 'find',
    }
    return latestState
  }
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.Find, FocusKey.FindWidget, editor, FindWidgetFactory.create, newStateGenerator)
}
