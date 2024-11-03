import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as SetAdditionalFocus from '../SetAdditionalFocus/SetAdditionalFocus.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'
import type { Widget } from '../Widget/Widget.ts'

export const addWidgetToEditor = async <K, T extends Widget<K>>(
  widgetId: number,
  focusKey: number,
  editor: any,
  factory: () => T,
  newStateGenerator: (state: K) => K | Promise<K>,
  fullFocus?: boolean
): Promise<any> => {
  const { widgets } = editor
  if (HasWidget.hasWidget(widgets, widgetId)) {
    return editor
  }
  const widget = factory()
  // @ts-ignore
  widget.newState.editorUid = editor.uid
  const newState = await newStateGenerator(widget.newState)
  // @ts-ignore
  newState.editorUid = editor.uid
  const latestWidget = {
    ...widget,
    newState,
  }
  const newWidgets = [...widgets, latestWidget]
  // TODO avoid side effect, apply focus shift during render
  if (fullFocus) {
    await SetFocus.setFocus(focusKey)
  } else {
    await SetAdditionalFocus.setAdditionalFocus(focusKey)
  }
  const newFocus = fullFocus ? false : true
  const newEditor = {
    ...editor,
    widgets: newWidgets,
    focusKey,
    focused: newFocus,
  }
  return newEditor
}
