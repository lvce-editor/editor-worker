import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchRenameWorker from '../LaunchRenameWorker/LaunchRenameWorker.ts'

const state: {
  workerPromise?: Promise<Rpc>
} = {}

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
