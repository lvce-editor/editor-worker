import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchFindWidgetWorker from '../LaunchFindWidgetWorker/LaunchFindWidgetWorker.ts'

let workerPromise: any

const getOrCreate = (): Promise<Rpc> => {
  if (!workerPromise) {
    workerPromise = LaunchFindWidgetWorker.launchFindWidgetWorker()
  }
  return workerPromise
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return await worker.invoke(method, ...params)
}
