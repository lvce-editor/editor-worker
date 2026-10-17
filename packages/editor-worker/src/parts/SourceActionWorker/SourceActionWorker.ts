import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchSourceActionWorker from '../LaunchSourceActionWorker/LaunchSourceActionWorker.ts'

const state: {
  workerPromise?: Promise<Rpc>
} = {}

const getOrCreate = (): Promise<Rpc> => {
  if (!state.workerPromise) {
    state.workerPromise = LaunchSourceActionWorker.launchSourceActionWorker()
  }
  return state.workerPromise
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return await worker.invoke(method, ...params)
}
