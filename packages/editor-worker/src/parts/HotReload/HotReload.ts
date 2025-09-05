import { getKeys } from '../Editors/Editors.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import { restoreWidgetState } from '../RestoreWidgetState/RestoreWidgetState.ts'
import { saveWidgetState } from '../SaveWidgetState/SaveWidgetState.ts'

let isReloading = false

const relaunchWorkers = async () => {
  await FindWidgetWorker.dispose()
  await FindWidgetWorker.launch()
}

export const hotReload = async (): Promise<void> => {
  if (isReloading) {
    return
  }
  isReloading = true

  // TODO use getEditors
  const keys = getKeys()

  const savedStates = await saveWidgetState(keys)

  await relaunchWorkers()

  const newEditors = await restoreWidgetState(keys, savedStates)

  if (newEditors) {
    // TODO set them
  }
  isReloading = false
  // TODO
  // 1. find all editors
  // 2. find all widgets
  // 3. find all workers
  // 4. reload the workers
  // 5. update the widgets with data from new workers
}
