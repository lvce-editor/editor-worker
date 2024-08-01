import * as JsonRpc from '@lvce-editor/json-rpc'

const workerPath = new URL('../dist/dist/editorWorkerMain.js', import.meta.url).toString()

const createWorker = async (workerPath) => {
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

const main = async () => {
  const rpc = await createWorker(workerPath)
  const syntaxHighlightingEnabled = true
  const syncIncremental = true
  await rpc.invoke('Initialize.initialize', syntaxHighlightingEnabled, syncIncremental)
  console.log('finish initializing')
}

main()
