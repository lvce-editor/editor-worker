import { WhenExpression } from '@lvce-editor/constants'
import type { Widget } from '../Widget/Widget.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'

const getWidgetIndex = <K>(widgets: readonly Widget<K>[], widgetId: number, uid: number): number => {
  return widgets.findIndex((widget: any) => widget.id === widgetId && widget.newState.uid === uid)
}

const hydrateWidget = <K>(editor: any, widgetId: number, uid: number, newState: K): any => {
  const widgetIndex = getWidgetIndex(editor.widgets, widgetId, uid)
  if (widgetIndex === -1) {
    return editor
  }
  const widget = editor.widgets[widgetIndex]
  const newWidget = {
    ...widget,
    oldState: widget.newState,
    newState,
  }
  return {
    ...editor,
    widgets: [...editor.widgets.slice(0, widgetIndex), newWidget, ...editor.widgets.slice(widgetIndex + 1)],
  }
}

const getLatestEditor = (uid: number, fallback: any): any => {
  const instance = EditorStates.get(uid)
  return instance?.newState || fallback
}

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
  const initialState = {
    ...widget.newState,
    editorUid: editor.uid,
  } as K
  const widgetUid = (initialState as any).uid
  const stagedWidget = {
    ...widget,
    newState: initialState,
  }
  const newWidgets = [...widgets, stagedWidget]
  const newFocus = !fullFocus
  const stagedEditor = {
    ...editor,
    additionalFocus: fullFocus ? 0 : focusKey,
    focus: fullFocus ? focusKey : WhenExpression.FocusEditorText,
    focused: newFocus,
    widgets: newWidgets,
  }
  if (fullFocus) {
    EditorStates.set(editor.uid, editor, stagedEditor)
  }
  const newState = await newStateGenerator(initialState, editor.uid)
  const latestState = {
    ...newState,
    editorUid: editor.uid,
  } as K
  if (fullFocus) {
    const latestEditor = getLatestEditor(editor.uid, stagedEditor)
    const hydratedEditor = hydrateWidget(latestEditor, widgetId, widgetUid, latestState)
    if (hydratedEditor !== latestEditor) {
      EditorStates.set(editor.uid, latestEditor, hydratedEditor)
    }
    return hydratedEditor
  }
  const latestWidget = {
    ...widget,
    newState: latestState,
  }
  return {
    ...stagedEditor,
    widgets: [...widgets, latestWidget],
  }
}
