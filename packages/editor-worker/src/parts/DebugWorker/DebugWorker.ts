import type { Rpc } from '@lvce-editor/rpc'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

let workerPromise: Promise<Rpc> | undefined

const getOrCreate = async (): Promise<Rpc> => {
  if (!workerPromise) {
    workerPromise = RendererWorker.invoke('DebugWorker.create')
  }
  return workerPromise
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const worker = await getOrCreate()
  return worker.invoke(method, ...params)
}
