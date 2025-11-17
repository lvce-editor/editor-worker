import * as Editors from '../Editors/Editors.ts'
import { getKeys } from '../Editors/Editors.ts'
import { relaunchWorkers } from '../RelaunchWorkers/RelaunchWorkers.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { restoreWidgetState } from '../RestoreWidgetState/RestoreWidgetState.ts'
import { saveWidgetState } from '../SaveWidgetState/SaveWidgetState.ts'

let isReloading = false

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
