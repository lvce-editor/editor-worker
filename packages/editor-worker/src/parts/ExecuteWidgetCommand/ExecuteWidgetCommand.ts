import { number } from '@lvce-editor/assert'
import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'
import * as CompletionWorker from '../CompletionWorker/CompletionWorker.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const getInvoke = (widgetId: number): any => {
  switch (widgetId) {
    case WidgetId.ColorPicker:
      return ColorPickerWorker.invoke
    case WidgetId.Completion:
      return CompletionWorker.invoke
    case WidgetId.Find:
      return FindWidgetWorker.invoke
    default:
      return undefined
  }
}

export const executeWidgetCommand = async (
  editor: any,
  name: string,
  method: string,
  _uid: number,
  widgetId: number,
  ...params: readonly any[]
): Promise<any> => {
  const invoke = getInvoke(widgetId)
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
  const newEditor = UpdateWidget.updateWidget(editor, widgetId, newState)
  return newEditor
}
