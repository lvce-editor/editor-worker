import { activate as activateExtensionApi, registerCommand, registerDiagnosticProvider } from '@lvce-editor/api'

const diagnostic = {
  columnIndex: 0,
  endColumnIndex: 7,
  endRowIndex: 0,
  message: 'Resolved diagnostic',
  rowIndex: 0,
  type: 'error',
}

const diagnosticsResult = Promise.withResolvers()

const diagnosticProvider = {
  id: 'pending-diagnostics',
  languageId: 'pending-diagnostics',
  async provideDiagnostics() {
    await diagnosticsResult.promise
    return [diagnostic]
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
registerCommand({
  id: 'pendingDiagnostics.resolve',
  execute() {
    diagnosticsResult.resolve()
  },
})
