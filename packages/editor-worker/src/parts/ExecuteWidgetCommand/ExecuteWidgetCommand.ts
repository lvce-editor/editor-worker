import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'

const getInvoke = (): any => {
  return ColorPickerWorker.invoke
}

export const executeWidgetCommand = async (editor: any, name: string, method: string, uid: number, ...params: readonly any[]): Promise<any> => {
  const invoke = getInvoke()
  await invoke(`${name}.${method}`, uid, ...params)
  const diff = await invoke(`${name}.diff2`, uid)
  const commands = await invoke(`${name}.render2`, uid, diff)
  return {
    ...editor,
    commands,
  }
}
