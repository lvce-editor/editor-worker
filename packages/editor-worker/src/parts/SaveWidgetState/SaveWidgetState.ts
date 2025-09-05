import { WidgetId } from '@lvce-editor/constants'
import { get } from '../Editors/Editors.ts'
import { getWidgetInvoke } from '../GetWidgetInvoke/GetWidgetInvoke.ts'

export const getWidgetName = (widgetId: number): string => {
  switch (widgetId) {
    case WidgetId.Find:
      return `FindWidget`
    default:
      return ''
  }
}

export const saveWidgetState = async (keys: readonly string[]): Promise<any> => {
  const savedStates = Object.create(null)
  for (const key of keys) {
    const editor = get(parseInt(key))
    const { widgets } = editor.newState
    for (const widget of widgets) {
      const invoke = getWidgetInvoke(widget.id)
      const fullKey = `${key}:${widget.newState.uid}`
      const name = getWidgetName(widget.id)
      const savedState = await invoke(`${name}.saveState`, widget.newState.uid)
      savedStates[fullKey] = savedState
    }
  }
  return savedStates
}
