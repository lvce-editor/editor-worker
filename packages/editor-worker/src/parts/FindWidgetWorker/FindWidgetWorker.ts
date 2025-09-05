import { get, remove, set } from '@lvce-editor/rpc-registry'
import * as LaunchFindWidgetWorker from '../LaunchFindWidgetWorker/LaunchFindWidgetWorker.ts'

const rpcId = 9002

export const launch = async () => {
  // TODO race condition
  if (get(rpcId)) {
    return
  }
  const rpc = await LaunchFindWidgetWorker.launchFindWidgetWorker()
  set(rpcId, rpc)
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const rpc = get(rpcId)
  return await rpc.invoke(method, ...params)
}

export const dispose = async () => {
  const rpc = get(rpcId)
  remove(rpcId)
  if (rpc) {
    await rpc.dispose()
  }
  // const oldPromise = workerPromise
  // workerPromise = undefined
  // const rpc = await oldPromise
  // await rpc.dispose()
}
