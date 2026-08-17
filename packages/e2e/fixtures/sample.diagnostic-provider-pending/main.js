import { activate as activateExtensionApi, exists, registerDiagnosticProvider } from '@lvce-editor/api'

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
  async provideDiagnostics(textDocument) {
    while (!(await exists(`${textDocument.uri}.resolve`))) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    return [diagnostic]
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
