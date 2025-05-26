import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchCompletionWorker from '../LaunchCompletionWorker/LaunchCompletionWorker.ts'

let workerPromise: any

const getOrCreate = (): Promise<Rpc> => {
  if (!workerPromise) {
    workerPromise = LaunchCompletionWorker.launchCompletionWorker()
  }
  return workerPromise
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return await worker.invoke(method, ...params)
}
