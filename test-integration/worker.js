import { IpcChildWithNodeWorker } from '@lvce-editor/ipc'

const createWorkerIpc = async (workerPath) => {
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
  await import(workerPath)
  await readyPromise
  return _listener
}

const handleMessage = async (event) => {
  const { data, target } = event
  if (data.method === 'loadEditorWorker') {
    await createWorkerIpc(...data.params)
  }
  console.log({ data })
  target.send({
    jsonrpc: '2.0',
    result: null,
    id: data.id,
  })
}

const main = async () => {
  const rawIpc = await IpcChildWithNodeWorker.listen()
  IpcChildWithNodeWorker.signal(rawIpc)
  const ipc = IpcChildWithNodeWorker.wrap(rawIpc)
  ipc.on('message', handleMessage)
}

main()
