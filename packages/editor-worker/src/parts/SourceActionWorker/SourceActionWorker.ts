import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchSourceActionWorker from '../LaunchSourceActionWorker/LaunchSourceActionWorker.ts'

let workerPromise: any

const getOrCreate = (): Promise<Rpc> => {
  if (!workerPromise) {
    workerPromise = LaunchSourceActionWorker.launchSourceActionWorker()
  }
  return workerPromise
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return await worker.invoke(method, ...params)
}
