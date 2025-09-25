import * as Editors from '../Editors/Editors.ts'
import * as GetWidgetInvoke from '../GetWidgetInvoke/GetWidgetInvoke.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'

const createFn = (key: string, name: string, widgetId: number) => {
  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const fn = async (editor: any, ...args: readonly any[]) => {
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
    const newState = {
      ...state,
      commands,
    }
    const latest = Editors.get(editor.uid).newState
    const newEditor = UpdateWidget.updateWidget(latest, widgetId, newState)
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
