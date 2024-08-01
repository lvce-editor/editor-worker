import * as JsonRpc from '@lvce-editor/json-rpc'
import { createMessagePortIpc } from './createMessagePortIpc.js'
import { createWorkerIpc } from './createWorkerIpc.js'

export const createWorker = async (workerPath) => {
  console.log('finished ready')
  const listener = await createWorkerIpc(workerPath)
  const ipc = await createMessagePortIpc(listener)
  console.log('finish first')
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
