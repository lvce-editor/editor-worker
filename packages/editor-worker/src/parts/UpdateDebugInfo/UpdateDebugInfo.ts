import * as Editors from '../Editors/Editors.ts'
import * as GetDebugHighlight from '../GetDebugHighlight/GetDebugHighlight.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const getKey = (): number => {
  const keys = Editors.getKeys()
  return parseInt(keys[0])
}

export const updateDebugInfo = async (debugId: number): Promise<void> => {
  const newInfo = await GetDebugHighlight.getDebugHighlight(debugId)
  const key = getKey()
  const { oldState, newState } = Editors.get(key)
  const newEditor = {
    ...newState,
    highlightedLine: newInfo.rowIndex,
  }
  Editors.set(key, oldState, newEditor)
  // @ts-ignore
  await RendererWorker.invoke('Editor.rerender', key)
}
