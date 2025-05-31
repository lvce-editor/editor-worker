import { number } from '@lvce-editor/assert'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import { getWidgetInvoke } from '../GetWidgetInvoke/GetWidgetInvoke.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'

export const executeWidgetCommand = async (
  editor: any,
  name: string,
  method: string,
  _uid: number,
  widgetId: number,
  ...params: readonly any[]
): Promise<any> => {
  const invoke = getWidgetInvoke(widgetId)
  const actualMethod = method.slice(name.length + 1)
  const widget = editor.widgets.find((widget: any) => widget.id === widgetId)
  if (!widget) {
    return editor
  }
  const { uid } = widget.newState
  number(uid)
  await invoke(`${name}.${actualMethod}`, uid, ...params)
  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const latestEditor = GetEditor.getEditor(editor.uid)
  const childIndex1 = latestEditor.widgets.findIndex(isWidget)
  if (childIndex1 === -1) {
    return latestEditor
  }

  const diff = await invoke(`${name}.diff2`, uid)
  const commands = await invoke(`${name}.render2`, uid, diff)

  const childIndex = editor.widgets.findIndex(isWidget)
  if (childIndex === -1) {
    return latestEditor
  }
  const childWidget = latestEditor.widgets[childIndex]
  const newState = {
    ...childWidget.newState,
    commands,
  }
  const newEditor = UpdateWidget.updateWidget(latestEditor, widgetId, newState)
  return newEditor
}
