import { get } from '../EditorStates/EditorStates.ts'
import * as GetWidgetHotReloadDescriptor from '../GetWidgetHotReloadDescriptor/GetWidgetHotReloadDescriptor.ts'

export const saveWidgetState = async (keys: readonly string[]): Promise<any> => {
  const savedStates = Object.create(null)
  for (const key of keys) {
    const editor = get(parseInt(key))
    if (!editor?.newState || !Array.isArray(editor.newState.widgets)) {
      continue
    }
    const { widgets } = editor.newState
    for (const widget of widgets) {
      if (!widget?.newState) {
        continue
      }
      const descriptor = GetWidgetHotReloadDescriptor.getWidgetHotReloadDescriptor(widget.id)
      if (!descriptor) {
        continue
      }
      const { invoke, name } = descriptor
      const { uid } = widget.newState
      const fullKey = `${key}:${uid}`
      const savedState = await invoke(`${name}.saveState`, uid)
      savedStates[fullKey] = savedState
    }
  }
  return savedStates
}
