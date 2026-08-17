import { activate as activateExtensionApi, registerCommand, registerDiagnosticProvider } from '@lvce-editor/api'

const { promise, resolve } = Promise.withResolvers()
let diagnosticsRequested = false

const diagnostic = {
  columnIndex: 0,
  endColumnIndex: 7,
  endRowIndex: 0,
  message: 'Resolved diagnostic',
  rowIndex: 0,
  type: 'error',
}

const diagnosticProvider = {
  id: 'pending-diagnostics',
  languageId: 'pending-diagnostics',
  provideDiagnostics() {
    diagnosticsRequested = true
    return promise
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
registerCommand({
  id: 'pendingDiagnostics.resolve',
  execute() {
    resolve([diagnostic])
    return diagnosticsRequested
  },
})
