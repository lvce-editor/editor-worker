import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchRenameWorker from '../LaunchRenameWorker/LaunchRenameWorker.ts'

const state: {
  workerPromise: Promise<Rpc> | undefined
} = {
  workerPromise: undefined,
}

const getOrCreate = (): Promise<Rpc> => {
  if (!state.workerPromise) {
    state.workerPromise = LaunchRenameWorker.launchRenameWorker()
  }
  return state.workerPromise
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return await worker.invoke(method, ...params)
}

export const dispose = async (): Promise<void> => {
  const { workerPromise } = state
  state.workerPromise = undefined
  if (!workerPromise) {
    return
  }
  try {
    const worker = await workerPromise
    await worker.dispose()
  } catch {
    // The worker may fail while it is initializing.
  }
}
