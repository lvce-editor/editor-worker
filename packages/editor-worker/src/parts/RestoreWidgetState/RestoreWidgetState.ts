import { get } from '../EditorStates/EditorStates.ts'
import * as GetWidgetHotReloadDescriptor from '../GetWidgetHotReloadDescriptor/GetWidgetHotReloadDescriptor.ts'

export const restoreWidgetState = async (keys: readonly string[], savedStates: any): Promise<readonly any[]> => {
  const newEditors = []
  for (const key of keys) {
    const editorUid = parseInt(key)
    const editor = get(editorUid)
    if (!editor?.newState || !Array.isArray(editor.newState.widgets)) {
      continue
    }
    const { widgets } = editor.newState
    const newWidgets = []
    let hasRestoredWidget = false
    for (const widget of widgets) {
      if (!widget?.newState) {
        newWidgets.push(widget)
        continue
      }
      const fullKey = `${key}:${widget.newState.uid}`
      const descriptor = GetWidgetHotReloadDescriptor.getWidgetHotReloadDescriptor(widget.id)
      if (!descriptor || !savedStates || !Object.hasOwn(savedStates, fullKey)) {
        newWidgets.push(widget)
        continue
      }
      const { invoke, name } = descriptor
      const savedState = savedStates[fullKey]
      await invoke(
        `${name}.create`,
        widget.newState.uid,
        widget.newState.x,
        widget.newState.y,
        widget.newState.width,
        widget.newState.height,
        editorUid,
      )
      await invoke(`${name}.loadContent`, widget.newState.uid, savedState)
      const diffResult = await invoke(`${name}.diff2`, widget.newState.uid)
      const commands = await invoke(`${name}.render2`, widget.newState.uid, diffResult)
      const newWidget = {
        ...widget,
        newState: { ...widget.newState, commands },
      }
      newWidgets.push(newWidget)
      hasRestoredWidget = true
    }
    if (!hasRestoredWidget) {
      newEditors.push(editor)
      continue
    }
    newEditors.push({
      ...editor,
      newState: {
        ...editor.newState,
        widgets: newWidgets,
      },
    })
  }
  return newEditors
}
