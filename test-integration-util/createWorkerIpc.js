import * as JsonRpc from '@lvce-editor/json-rpc'
import { fileURLToPath } from 'node:url'
import { MessageChannel, Worker } from 'node:worker_threads'

const createIpc = async (workerUrl) => {
  const worker = new Worker(workerUrl, {})
  const target = new EventTarget()
  return {
    addEventListener(type, listener) {
      target.addEventListener(type, listener)
    },
    dispose() {
      worker.terminate()
    },
  }
}

class Ipc {
  constructor(workerUrl) {}
}

export const createWorkerIpc = async (workerPath) => {
  const workerUrl = fileURLToPath(new URL('./worker.js', import.meta.url))

  const ipc = await createIpc(workerUrl)

  ipc.on('message', (event) => {
    const message = event.data
    JsonRpc.resolve(message.id, message)
  })

  const { port1, port2 } = new MessageChannel()
  await JsonRpc.invokeAndTransfer(ipc, 'loadEditorWorker', workerPath, port1)
  return {
    port: port2,
    ipc,
  }
}
