import * as Editors from '../EditorStates/EditorStates.ts'
import * as GetWidgetInvoke from '../GetWidgetInvoke/GetWidgetInvoke.ts'
import * as Names from '../Names/Names.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'

const getEditorByWidgetUid = (widgetUid: number, widgetId: number): any => {
  for (const key of Editors.getKeys()) {
    const editor = Editors.get(Number(key)).newState
    const widgets = editor.widgets || []
    for (const widget of widgets) {
      if (widget.id === widgetId && widget.newState.uid === widgetUid) {
        return editor
      }
    }
  }
  return undefined
}

const getEditor = (editorOrUid: any, widgetId: number): any => {
  if (editorOrUid && editorOrUid.widgets) {
    return editorOrUid
  }
  const instance = Editors.get(editorOrUid)
  if (instance && instance.newState && instance.newState.widgets) {
    return instance.newState
  }
  return getEditorByWidgetUid(editorOrUid, widgetId)
}

const createFn = (key: string, name: string, widgetId: number) => {
  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const isClose = (args: readonly any[]): boolean => {
    return key === 'close' || (key === 'handleClickButton' && args.includes(Names.Close))
  }
  const fn = async (editorOrUid: any, ...args: readonly any[]) => {
    const editor = getEditor(editorOrUid, widgetId)
    if (!editor) {
      return editorOrUid
    }
    const childIndex = editor.widgets.findIndex(isWidget)
    if (childIndex === -1) {
      return editor
    }
    // TODO scroll up/down if necessary
    const childWidget = editor.widgets[childIndex]
    const state = childWidget.newState
    const { uid } = state
    const invoke = GetWidgetInvoke.getWidgetInvoke(widgetId)
    await invoke(`${name}.${key}`, uid, ...args)
    const diff = await invoke(`${name}.diff2`, uid)
    const commands = await invoke(`${name}.render2`, uid, diff)
    const latest = Editors.get(editor.uid).newState
    if (isClose(args)) {
      const newEditor = {
        ...latest,
        focused: true,
        widgets: RemoveEditorWidget.removeEditorWidget(latest.widgets, widgetId),
      }
      Editors.set(editor.uid, latest, newEditor)
      return newEditor
    }
    const newState = {
      ...state,
      commands,
    }
    const newEditor = UpdateWidget.updateWidget(latest, widgetId, newState)
    Editors.set(editor.uid, latest, newEditor)
    return newEditor
  }
  return fn
}

export const createFns = (keys: readonly string[], name: string, widgetId: number): any => {
  const fns = Object.create(null)
  for (const key of keys) {
    fns[key] = createFn(key, name, widgetId)
  }
  return fns
}
