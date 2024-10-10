import * as FindWidgetFactory from '../FindWidgetFactory/FindWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as SetAdditionalFocus from '../SetAdditionalFocus/SetAdditionalFocus.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as FindWidgetFunctions from '../FindWidgetFunctions/FindWidgetFunctions.ts'
import { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'

export const openFind2 = async (editor: any) => {
  const { widgets } = editor
  if (HasWidget.hasWidget(widgets, WidgetId.Find)) {
    return editor
  }
  const findWidget: IFindWidget = FindWidgetFactory.create()

  const { value, matches, matchCount, matchIndex } = await FindWidgetFunctions.loadContent(editor.uid)

  const latestState: FindWidgetState = {
    ...findWidget.newState,
    value,
    matches,
    matchCount,
    matchIndex,
  }

  const newWidget: IFindWidget = {
    ...findWidget,
    newState: latestState,
  }

  const newWidgets = [...widgets, newWidget]
  // TODO avoid side effect, apply focus shift during render
  await SetAdditionalFocus.setAdditionalFocus(FocusKey.FindWidget)
  const newEditor = {
    ...editor,
    widgets: newWidgets,
  }
  // TODO
  return {
    ...newEditor,
  }
}
