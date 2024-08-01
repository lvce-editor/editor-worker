import { Worker } from 'node:worker_threads'
import { IpcParentWithNodeWorker } from '@lvce-editor/ipc'
import { fileURLToPath } from 'node:url'
import * as JsonRpc from '@lvce-editor/json-rpc'

export const createWorkerIpc = async (workerPath) => {
  globalThis.WorkerGlobalScope = {}

  globalThis.OffscreenCanvas = class {
    getContext() {
      return {
        measureText() {
          return 2
        },
      }
    }
  }

  const readyPromise = new Promise((resolve) => {
    globalThis.postMessage = (message) => {
      if (message === 'ready') {
        resolve(undefined)
      }
    }
  })

  let _listener = (data) => {}

  globalThis.addEventListener = (type, listener, options) => {
    _listener = listener
  }

  const workerUrl = fileURLToPath(new URL('./worker.js', import.meta.url))
  const rawIpc = await IpcParentWithNodeWorker.create({
    path: workerUrl,
  })
  const ipc = IpcParentWithNodeWorker.wrap(rawIpc)

  ipc.on('message', (event) => {
    const message = event.data
    JsonRpc.resolve(message.id, message)
  })
  console.log('will load editor worker')
  await JsonRpc.invoke(ipc, 'loadEditorWorker', workerPath)
  console.log('did load editor worker')
  console.log({ ipc })

  await readyPromise
  return _listener
}
