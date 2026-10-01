import { activate as activateExtensionApi, registerCommand, registerDiagnosticProvider } from '@lvce-editor/api'

const pendingRequests = []
let slowRequestCount = 0

await activateExtensionApi()
registerDiagnosticProvider({
  id: 'retained-fast-diagnostics',
  languageId: 'xyz',
  provideDiagnostics(textDocument) {
    return [
      {
        columnIndex: 0,
        endColumnIndex: textDocument.text.length,
        endRowIndex: 0,
        message: `Fast ${textDocument.text}`,
        rowIndex: 0,
        type: 'warning',
      },
    ]
  },
})
registerDiagnosticProvider({
  id: 'retained-slow-diagnostics',
  languageId: 'xyz',
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
        endColumnIndex: 4,
        endRowIndex: 0,
        message: `Slow ${request.index}`,
        rowIndex: 0,
        type: 'error',
      },
    ])
  },
})
