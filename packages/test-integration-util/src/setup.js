import { createWorker } from './createWorker.js'

const workerPath = new URL('../../../.tmp/dist/dist/editorWorkerMain.js', import.meta.url).toString()

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
  if (method === 'ExtensionHostTabCompletion.execute') {
    return {
      deleted: 6,
      inserted: '<button>$0</button>',
      type: 2,
    }
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

const createWrappedRpc = (rpc) => {
  rpc.Editor ||= {}
  rpc.Editor.create = (...params) => {
    return rpc.invoke('Editor.create', ...params)
  }
  rpc.Editor.cursorSet = (...params) => {
    return rpc.invoke('Editor.cursorSet', ...params)
  }
  rpc.Editor.type = (...params) => {
    return rpc.invoke('Editor.type', ...params)
  }
  rpc.Editor.toggleComment = (...params) => {
    return rpc.invoke('Editor.toggleComment', ...params)
  }
  rpc.Editor.toggleBlockComment = (...params) => {
    return rpc.invoke('Editor.toggleBlockComment', ...params)
  }
  rpc.Editor.handleTab = (...params) => {
    return rpc.invoke('Editor.handleTab', ...params)
  }
  rpc.Editor.openCompletion = (...params) => {
    return rpc.invoke('Editor.openCompletion', ...params)
  }
  rpc.Editor.selectWord = (...params) => {
    return rpc.invoke('Editor.selectWord', ...params)
  }
  rpc.Editor.openFind2 = (...params) => {
    return rpc.invoke('Editor.openFind2', ...params)
  }
  rpc.Editor.openRename = (...params) => {
    return rpc.invoke('Editor.openRename', ...params)
  }
  rpc.Editor.closeRename = (...params) => {
    return rpc.invoke('Editor.closeRename', ...params)
  }
  rpc.Editor.deleteCharacterLeft = (...params) => {
    return rpc.invoke('Editor.deleteCharacterLeft', ...params)
  }
  rpc.Editor.deleteCharacterRight = (...params) => {
    return rpc.invoke('Editor.deleteCharacterRight', ...params)
  }
  rpc.Editor.showSourceActions = (...params) => {
    return rpc.invoke('Editor.showSourceActions', ...params)
  }
  rpc.Editor.getSelections = (...params) => {
    return rpc.invoke('Editor.getSelections', ...params)
  }
  rpc.Editor.deleteWordLeft = (...params) => {
    return rpc.invoke('Editor.deleteWordLeft', ...params)
  }
  rpc.Editor.getText = (...params) => {
    return rpc.invoke('Editor.getText', ...params)
  }
  rpc.EditorCompletion ||= {}
  rpc.EditorCompletion.openDetails = (...params) => {
    return rpc.invoke('EditorCompletion.openDetails', ...params)
  }
  rpc.EditorCompletion.closeDetails = (...params) => {
    return rpc.invoke('EditorCompletion.closeDetails', ...params)
  }
  rpc.EditorCompletion.focusIndex = (...params) => {
    return rpc.invoke('EditorCompletion.focusIndex', ...params)
  }
  rpc.EditorCompletion.focusFirst = (...params) => {
    return rpc.invoke('EditorCompletion.focusFirst', ...params)
  }
  rpc.EditorSourceActions ||= {}
  rpc.EditorSourceActions.focusNext = (...params) => {
    return rpc.invoke('EditorSourceActions.focusNext', ...params)
  }
  return rpc
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
    'GetEditorSourceActions.getEditorSourceActions'() {
      return [
        {
          name: 'a',
        },
      ]
    },
    'Focus.setAdditionalFocus'() {},
    'Focus.setFocus'() {},
    'Viewlet.openWidget'() {},
    'Languages.getLanguageConfiguration'() {
      return {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/'],
        },
      }
    },
  }
  const rpc = await createWorker(workerPath, commandMap)
  const syntaxHighlightingEnabled = true
  const syncIncremental = true
  await rpc.invoke('Initialize.initialize', syntaxHighlightingEnabled, syncIncremental)
  const wrapped = createWrappedRpc(rpc)
  return wrapped
}
