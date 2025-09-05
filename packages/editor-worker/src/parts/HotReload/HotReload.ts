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

const saveState = async () => {
  const keys = getKeys()
  const savedStates = Object.create(null)
  for (const key of keys) {
    const editor = get(parseInt(key))
    const widgets = editor.newState.widgets
    for (const widget of widgets) {
      const invoke = getWidgetInvoke(widget.id)
      const fullKey = `${key}:${widget.uid}`
      const name = getWidgetName(widget.id)
      const savedState = await invoke(`${name}.saveState`, widget.uid)
      savedStates[fullKey] = savedState
    }
  }
  return savedStates
}

const relaunchWorkers = async () => {
  await FindWidgetWorker.dispose()
  await FindWidgetWorker.launch()
}

const restoreState = async (savedState: any) => {
  // TODO
}

export const hotReload = async (): Promise<void> => {
  if (isReloading) {
    return
  }
  isReloading = true

  // TODO save state

  const savedStates = await saveState()

  await relaunchWorkers()

  console.log({ savedStates })

  await restoreState(savedStates)

  console.log('hot reload')

  isReloading = false
  // TODO
  // 1. find all editors
  // 2. find all widgets
  // 3. find all workers
  // 4. reload the workers
  // 5. update the widgets with data from new workers
}
