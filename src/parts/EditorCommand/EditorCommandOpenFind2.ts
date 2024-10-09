import * as FindWidgetFactory from '../FindWidgetFactory/FindWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import { IFindWidget } from '../IFindWidget/IFindWidget.ts'
import * as SetAdditionalFocus from '../SetAdditionalFocus/SetAdditionalFocus.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openFind2 = async (editor: any) => {
  const { widgets } = editor
  if (HasWidget.hasWidget(widgets, WidgetId.Find)) {
    return editor
  }
  const findWidget: IFindWidget = FindWidgetFactory.create()
  const newWidget = {
    ...findWidget,
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
