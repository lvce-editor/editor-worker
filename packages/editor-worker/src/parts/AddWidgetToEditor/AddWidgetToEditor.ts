import { WhenExpression } from '@lvce-editor/constants'
import type { Widget } from '../Widget/Widget.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

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
    newState,
    oldState: widget.newState,
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
  newStateGenerator: (state: K, uid: number) => K | undefined | Promise<K | undefined>,
  fullFocus?: boolean,
): Promise<any> => {
  const { widgets = [] } = editor
  if (HasWidget.hasWidget(widgets, widgetId)) {
    return editor
  }
  const widgetRevision = WidgetRevision.next(editor.uid)
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
  const stagedEditor = {
    ...editor,
    additionalFocus: fullFocus ? 0 : focusKey,
    focus: fullFocus ? focusKey : WhenExpression.FocusEditorText,
    focused: !fullFocus,
    widgetRevision,
    widgets: newWidgets,
  }
  if (fullFocus) {
    // Staging changes pending state; only rendering may advance the mounted baseline.
    EditorStates.set(editor.uid, EditorStates.get(editor.uid)?.oldState || editor, stagedEditor)
  }
  const newState = await newStateGenerator(initialState, editor.uid)
  if (!newState) {
    if (WidgetRevision.get(editor.uid) !== widgetRevision) {
      return getLatestEditor(editor.uid, editor)
    }
    if (fullFocus) {
      const latestEditor = getLatestEditor(editor.uid, stagedEditor)
      if (latestEditor === stagedEditor) {
        EditorStates.set(editor.uid, EditorStates.get(editor.uid)?.oldState || editor, editor)
      }
      return latestEditor === stagedEditor ? editor : latestEditor
    }
    return editor
  }
  const latestState = {
    ...newState,
    editorUid: editor.uid,
  } as K
  if (fullFocus) {
    const currentEditor = getLatestEditor(editor.uid, stagedEditor)
    // A concurrent editor update based on the pre-staging state can replace the
    // staged widget list. Restore it only when the original widget list is still
    // current; a changed list may represent an explicit close.
    const latestEditor = currentEditor.widgets === editor.widgets ? { ...currentEditor, widgets: newWidgets } : currentEditor
    const hydratedEditor = hydrateWidget(latestEditor, widgetId, widgetUid, latestState)
    if (hydratedEditor !== latestEditor) {
      EditorStates.set(editor.uid, EditorStates.get(editor.uid)?.oldState || editor, hydratedEditor)
    }
    return hydratedEditor
  }
  if (WidgetRevision.get(editor.uid) !== widgetRevision) {
    return getLatestEditor(editor.uid, editor)
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
