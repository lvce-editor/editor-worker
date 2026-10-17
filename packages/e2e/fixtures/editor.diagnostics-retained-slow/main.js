import { activate as activateExtensionApi, registerCommand, registerDiagnosticProvider } from '@lvce-editor/api'

const pendingRequests = []
let slowRequestCount = 0

await activateExtensionApi()
registerDiagnosticProvider({
  id: 'retained-slow-diagnostics',
  languageId: 'retained-diagnostics',
  provideDiagnostics(textDocument) {
    const result = Promise.withResolvers()
    const lines = textDocument.text.split('\n')
    const diagnosticRowIndex = lines.findIndex((line) => line.startsWith('x'))
    const rowIndex = diagnosticRowIndex === -1 ? Math.min(1, lines.length - 1) : diagnosticRowIndex
    pendingRequests.push({
      columnIndex: lines[rowIndex].startsWith('x') ? 1 : 0,
      index: ++slowRequestCount,
      result,
      rowIndex,
    })
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
        columnIndex: request.columnIndex,
        endColumnIndex: request.columnIndex + 6,
        endRowIndex: request.rowIndex,
        message: `Slow ${request.index}`,
        rowIndex: request.rowIndex,
        type: 'error',
      },
    ])
  },
})
