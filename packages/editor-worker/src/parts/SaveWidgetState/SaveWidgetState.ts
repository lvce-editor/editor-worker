import { get } from '../EditorStates/EditorStates.ts'
import * as GetWidgetHotReloadDescriptor from '../GetWidgetHotReloadDescriptor/GetWidgetHotReloadDescriptor.ts'

const saveSingleWidgetState = async (savedStates: any, key: string, widget: any): Promise<void> => {
  if (!widget?.newState) {
    return
  }
  const descriptor = GetWidgetHotReloadDescriptor.getWidgetHotReloadDescriptor(widget.id)
  if (!descriptor) {
    return
  }
  const { invoke, name } = descriptor
  const { uid } = widget.newState
  const fullKey = `${key}:${uid}`
  const savedState = await invoke(`${name}.saveState`, uid)
  savedStates[fullKey] = savedState
}

export const saveWidgetState = async (keys: readonly string[]): Promise<any> => {
  const savedStates = Object.create(null)
  for (const key of keys) {
    const editor = get(parseInt(key))
    if (!editor?.newState || !Array.isArray(editor.newState.widgets)) {
      continue
    }
    const { widgets } = editor.newState
    for (const widget of widgets) {
      await saveSingleWidgetState(savedStates, key, widget)
    }
  }
  return savedStates
}
