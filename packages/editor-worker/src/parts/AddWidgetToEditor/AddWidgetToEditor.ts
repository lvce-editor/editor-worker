import { WhenExpression } from '@lvce-editor/constants'
import type { Widget } from '../Widget/Widget.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

export const addWidgetToEditor = async <K, T extends Widget<K>>(
  widgetId: number,
  focusKey: number,
  editor: any,
  factory: () => T,
  newStateGenerator: (state: K, uid: number) => K | undefined | Promise<K | undefined>,
  fullFocus?: boolean,
): Promise<any> => {
  const { widgets = [] } = editor
  if (HasWidget.hasWidget(widgets, widgetId)) {
    return editor
  }
  const widgetRevision = WidgetRevision.next(editor.uid)
  const widget = factory()
  // @ts-ignore
  widget.newState.editorUid = editor.uid
  const newState = await newStateGenerator(widget.newState, editor.uid)
  if (!newState) {
    return editor
  }
  if (WidgetRevision.get(editor.uid) !== widgetRevision) {
    return EditorStates.get(editor.uid)?.newState || editor
  }
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
    additionalFocus: fullFocus ? 0 : focusKey,
    focus: fullFocus ? focusKey : WhenExpression.FocusEditorText,
    focused: newFocus,
    widgetRevision,
    widgets: newWidgets,
  }
  return newEditor
}
