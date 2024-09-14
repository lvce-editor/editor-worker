import { IpcChildWithNodeWorker } from '@lvce-editor/ipc'

const createWorkerIpc = async (workerPath) => {
  try {
    globalThis.WorkerGlobalScope = {}

    globalThis.OffscreenCanvas = class {
      getContext() {
        return {
          measureText() {
            return {
              width: 2,
            }
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
  } catch (error) {
    throw new VError(error, `Failed to start worker`)
  }
}

export const createMessagePortIpc = async (listener, port) => {
  listener({
    data: {
      method: 'initialize',
      params: ['message-port', port],
    },
  })
}

const handleMessage = async (event) => {
  console.log(event)
  const { data, target } = event
  if (data.method === 'loadEditorWorker') {
    const workerPath = data.params[0]
    const port = data.params[1]
    if (!port) {
      throw new Error('port is required')
    }
    console.log('load editor worker', workerPath, port)
    const listener = await createWorkerIpc(workerPath)
    await createMessagePortIpc(listener, port)
  }
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
