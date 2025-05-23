import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'
import * as UpdateWidget from '../UpdateWidget/UpdateWidget.ts'

const getInvoke = (): any => {
  return ColorPickerWorker.invoke
}

export const executeWidgetCommand = async (
  editor: any,
  name: string,
  method: string,
  uid: number,
  widgetId: number,
  ...params: readonly any[]
): Promise<any> => {
  const invoke = getInvoke()
  const actualMethod = method.slice(name.length + 1)
  await invoke(`${name}.${actualMethod}`, uid, ...params)
  const diff = await invoke(`${name}.diff2`, uid)
  const commands = await invoke(`${name}.render2`, uid, diff)

  const isWidget = (widget: any) => {
    return widget.id === widgetId
  }
  const childIndex = editor.widgets.findIndex(isWidget)
  const childWidget = editor.widgets[childIndex]
  const newState = {
    ...childWidget.state,
    commands,
  }
  const newEditor = UpdateWidget.updateWidget(editor, widgetId, newState)
  return newEditor
}
