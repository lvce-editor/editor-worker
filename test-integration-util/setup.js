import { createWorker } from './createWorker.js'

const workerPath = new URL('../dist/dist/editorWorkerMain.js', import.meta.url).toString()

const getResult = (method, ...params) => {
  if (method === 'GetTokensViewport.getTokensViewport') {
    return {
      tokens: new Uint32Array([0, 0]),
      tokenizersToLoad: [],
      embeddedResults: [],
    }
  }
  if (method === 'ExtensionHostCompletion.execute') {
    return [
      {
        label: 'abc 1',
      },
      {
        label: 'abc 2',
      },
    ]
  }
  return null
}

const handleMessage = (event) => {
  const { data, target } = event
  if (data.id) {
    const result = getResult(data.method, ...data.params)
    target.postMessage({
      jsonrpc: '2.0',
      id: data.id,
      result,
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
    'ExtensionHostManagement.activateByEvent'() {},
    'Focus.setAdditionalFocus'() {},
    'Focus.setFocus'() {},
    'Viewlet.openWidget'() {},
  }
  const rpc = await createWorker(workerPath, commandMap)
  const syntaxHighlightingEnabled = true
  const syncIncremental = true
  await rpc.invoke('Initialize.initialize', syntaxHighlightingEnabled, syncIncremental)
  return rpc
}
