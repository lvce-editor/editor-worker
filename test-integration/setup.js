import { createWorker } from './createWorker.js'

const workerPath = new URL('../dist/dist/editorWorkerMain.js', import.meta.url).toString()

export const setup = async () => {
  const commandMap = {
    'SendMessagePortToRendererProcess.sendMessagePortToRendererProcess'(port) {
      port.postMessage('ready')
    },
    'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker'(port) {
      port.postMessage('ready')
    },
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker'(port) {
      port.addEventListener('message', (x) => {
        const { data } = x
        if (data.id) {
          port.postMessage({
            jsonrpc: '2.0',
            id: data.id,
            result: null,
          })
        }
      })
      port.postMessage('ready')
    },
  }
  const rpc = await createWorker(workerPath, commandMap)
  const syntaxHighlightingEnabled = true
  const syncIncremental = true
  await rpc.invoke('Initialize.initialize', syntaxHighlightingEnabled, syncIncremental)
  return rpc
}
