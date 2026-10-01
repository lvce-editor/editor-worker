import { activate as activateExtensionApi, registerCommand, registerDiagnosticProvider } from '@lvce-editor/api'

const pendingRequests = []
let slowRequestCount = 0

await activateExtensionApi()
registerDiagnosticProvider({
  id: 'retained-slow-diagnostics',
  languageId: 'retained-diagnostics',
  provideDiagnostics() {
    const result = Promise.withResolvers()
    pendingRequests.push({ index: ++slowRequestCount, result })
    return result.promise
  },
})
registerCommand({
  id: 'retainedDiagnostics.pendingCount',
  execute() {
    return pendingRequests.length
  },
})
registerCommand({
  id: 'retainedDiagnostics.resolveSlow',
  execute() {
    const request = pendingRequests.shift()
    if (!request) {
      throw new Error('No pending slow diagnostic request')
    }
    request.result.resolve([
      {
        columnIndex: 0,
        endColumnIndex: 6,
        endRowIndex: 1,
        message: `Slow ${request.index}`,
        rowIndex: 1,
        type: 'error',
      },
    ])
  },
})
