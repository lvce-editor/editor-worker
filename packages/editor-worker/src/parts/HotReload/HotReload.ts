import { WidgetId } from '@lvce-editor/constants'
import { get, getKeys } from '../Editors/Editors.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import { getWidgetInvoke } from '../GetWidgetInvoke/GetWidgetInvoke.ts'

let isReloading = false

const getWidgetName = (widgetId: number): string => {
  switch (widgetId) {
    case WidgetId.Find:
      return `FindWidget`
    default:
      return ''
  }
}

const saveState = async (keys: readonly string[]): Promise<any> => {
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

const relaunchWorkers = async () => {
  await FindWidgetWorker.dispose()
  await FindWidgetWorker.launch()
}

const restoreState = async (keys: readonly string[], savedStates: any) => {
  for (const key of keys) {
    const editorUid = parseInt(key)
    const editor = get(editorUid)
    const { widgets } = editor.newState
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
      if (newWidget) {
        // TODO add newwidget to editor
        // then rerender editor
      }
    }
  }

  // TODO
}

export const hotReload = async (): Promise<void> => {
  if (isReloading) {
    return
  }
  isReloading = true

  const keys = getKeys()

  const savedStates = await saveState(keys)

  await relaunchWorkers()

  await restoreState(keys, savedStates)

  isReloading = false
  // TODO
  // 1. find all editors
  // 2. find all widgets
  // 3. find all workers
  // 4. reload the workers
  // 5. update the widgets with data from new workers
}
