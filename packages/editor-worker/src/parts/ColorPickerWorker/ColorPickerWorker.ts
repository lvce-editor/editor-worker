import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchColorPickerWorker from '../LaunchColorPickerWorker/LaunchColorPickerWorker.ts'

let workerPromise: any

const getOrCreate = (): Promise<Rpc> => {
  if (!workerPromise) {
    workerPromise = LaunchColorPickerWorker.launchColorPickerWorker()
  }
  return workerPromise
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return await worker.invoke(method, ...params)
}
