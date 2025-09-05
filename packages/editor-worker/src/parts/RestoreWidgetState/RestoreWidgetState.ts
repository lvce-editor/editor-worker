import { get } from '../Editors/Editors.ts'
import { getWidgetInvoke } from '../GetWidgetInvoke/GetWidgetInvoke.ts'
import { getWidgetName } from '../SaveWidgetState/SaveWidgetState.ts'

export const restoreWidgetState = async (keys: readonly string[], savedStates: any): Promise<readonly any[]> => {
  const newEditors = []
  for (const key of keys) {
    const editorUid = parseInt(key)
    const editor = get(editorUid)
    const { widgets } = editor.newState
    const newWidgets = []
    for (const widget of widgets) {
      const invoke = getWidgetInvoke(widget.id)
      // TODO call
      // 1. create
      // 2. loadContent (with savedState)
      // 3. diff
      // 4. render
      const fullKey = `${key}:${widget.newState.uid}`
      const savedState = savedStates[fullKey] || {}
      const name = getWidgetName(widget.id)
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
      const commands = invoke(`${name}.render2`, widget.newState.uid, diffResult)
      const newWidget = {
        ...widget,
        newState: { ...widget.newState, commands },
      }
      newWidgets.push(newWidget)
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
