import { fileURLToPath } from 'url'
import { createWorker } from './createWorker.js'

const workerPath = fileURLToPath(new URL('../dist/dist/editorWorkerMain.js', import.meta.url).toString())

const handleMessage = (event) => {
  const { data, target } = event
  if (data.id) {
    target.postMessage({
      jsonrpc: '2.0',
      id: data.id,
      result: null,
    })
  }
}

export const setup = async () => {
  const commandMap = {
    'SendMessagePortToRendererProcess.sendMessagePortToRendererProcess'(port) {
      port.addEventListener('message', handleMessage)
      port.postMessage('ready')
    },
    'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker'(port) {
      port.addEventListener('message', handleMessage)
      port.postMessage('ready')
    },
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker'(port) {
      port.addEventListener('message', handleMessage)
      port.postMessage('ready')
    },
    'Editor.setSelections'() {},
  }
  const rpc = await createWorker(workerPath, commandMap)
  const syntaxHighlightingEnabled = true
  const syncIncremental = true
  await rpc.invoke('Initialize.initialize', syntaxHighlightingEnabled, syncIncremental)
  return rpc
}
