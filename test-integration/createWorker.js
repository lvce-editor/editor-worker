import * as JsonRpc from '@lvce-editor/json-rpc'

export const createWorker = async (workerPath) => {
  let _listener = (data) => {}
  globalThis.WorkerGlobalScope = {}
  const { port1, port2 } = new MessageChannel()
  let _resolve
  const promise = new Promise((resolve) => {
    _resolve = resolve
  })
  globalThis.addEventListener = (type, listener) => {
    _listener = listener
    _listener({
      data: {
        method: 'initialize',
        params: ['message-port', port1],
      },
    })
    _resolve()
  }
  globalThis.postMessage = (message) => {
    if (message === 'ready') {
      return
    }
    console.log({ message })
    JsonRpc.resolve(message.id, message)
  }
  await import(workerPath)
  const ipc = {
    send(message) {
      port2.postMessage(message)
    },
  }
  await promise
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
