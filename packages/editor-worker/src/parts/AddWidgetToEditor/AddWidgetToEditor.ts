import { WhenExpression } from '@lvce-editor/constants'
import type { Widget } from '../Widget/Widget.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'

export const addWidgetToEditor = async <K, T extends Widget<K>>(
  widgetId: number,
  focusKey: number,
  editor: any,
  factory: () => T,
  newStateGenerator: (state: K, uid: number) => K | Promise<K>,
  fullFocus?: boolean,
): Promise<any> => {
  const { widgets } = editor
  if (HasWidget.hasWidget(widgets, widgetId)) {
    return editor
  }
  const widget = factory()
  // @ts-ignore
  widget.newState.editorUid = editor.uid
  const newState = await newStateGenerator(widget.newState, editor.uid)
  // @ts-ignore
  newState.editorUid = editor.uid
  const latestWidget = {
    ...widget,
    newState,
  }
  const newWidgets = [...widgets, latestWidget]
  const newFocus = !fullFocus

  const newEditor = {
    ...editor,
    widgets: newWidgets,
    focused: newFocus,
    focus: fullFocus ? focusKey : WhenExpression.FocusEditorText,
    additionalFocus: fullFocus ? 0 : focusKey,
  }
  return newEditor
}
