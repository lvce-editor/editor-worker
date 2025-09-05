import { getKeys } from '../Editors/Editors.ts'
import * as Editors from '../Editors/Editors.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
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

  for (const editor of newEditors) {
    Editors.set(editor.newState.uid, editor.oldState, editor.newState)
  }

  // TODO ask renderer worker to rerender all editors
  // @ts-ignore
  await RendererWorker.invoke(`Editor.rerender`)

  isReloading = false
}
