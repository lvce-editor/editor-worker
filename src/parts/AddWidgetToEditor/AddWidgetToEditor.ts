import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as SetAdditionalFocus from '../SetAdditionalFocus/SetAdditionalFocus.ts'
import type { Widget } from '../Widget/Widget.ts'

export const addWidgetToEditor = async <K, T extends Widget<K>>(
  widgetId: string,
  focusKey: number,
  editor: any,
  factory: () => T,
  newStateGenerator: (state: K) => K
): Promise<any> => {
  const { widgets } = editor
  if (HasWidget.hasWidget(widgets, widgetId)) {
    return editor
  }
  const widget = factory()
  const newState = await newStateGenerator(widget.newState)
  const latestWidget = {
    ...widget,
    newState,
  }
  const newWidgets = [...widgets, latestWidget]
  // TODO avoid side effect, apply focus shift during render
  await SetAdditionalFocus.setAdditionalFocus(focusKey)
  const newEditor = {
    ...editor,
    widgets: newWidgets,
  }
  return newEditor
}
