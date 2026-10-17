import { activate as activateExtensionApi, registerCommand, registerDiagnosticProvider } from '@lvce-editor/api'

const pendingRequests = []
let resolvedCount = 0

const diagnosticProvider = {
  id: 'diagnostics-scroll-race',
  languageId: 'diagnostics-scroll-race',
  provideDiagnostics() {
    const result = Promise.withResolvers()
    pendingRequests.push(result)
    return result.promise
  },
}

const resolvePending = (diagnostics) => {
  const requests = pendingRequests.splice(0)
  if (requests.length === 0) {
    throw new Error('No pending diagnostics request')
  }
  for (const request of requests) {
    request.resolve(diagnostics)
  }
  resolvedCount += requests.length
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
registerCommand({
  id: 'diagnosticsScroll.pendingCount',
  execute() {
    return pendingRequests.length
  },
})
registerCommand({
  id: 'diagnosticsScroll.resolvedCount',
  execute() {
    return resolvedCount
  },
})
registerCommand({
  id: 'diagnosticsScroll.resolveEmpty',
  execute() {
    resolvePending([])
  },
})
registerCommand({
  id: 'diagnosticsScroll.resolveMany',
  execute(revision = 1, count = 120) {
    resolvePending(
      Array.from({ length: count }, (_, rowIndex) => ({
        code: `diagnostics-scroll-race-${revision}-${rowIndex}`,
        columnIndex: 1,
        endColumnIndex: 2,
        endRowIndex: rowIndex,
        message: `Delayed diagnostic ${revision} on row ${rowIndex}`,
        rowIndex,
        source: 'test',
        type: 'error',
      })),
    )
  },
})
registerCommand({
  id: 'diagnosticsScroll.resolveSingle',
  execute(rowIndex = 40) {
    resolvePending([
      {
        code: 'diagnostics-scroll-race',
        columnIndex: 0,
        endColumnIndex: 7,
        endRowIndex: rowIndex,
        message: 'Delayed diagnostic',
        rowIndex,
        source: 'test',
        type: 'error',
      },
    ])
  },
})
