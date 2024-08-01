export const createWorkerIpc = async (workerPath) => {
  globalThis.WorkerGlobalScope = {}

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
