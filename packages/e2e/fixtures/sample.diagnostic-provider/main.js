import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

const diagnosticProvider = {
  id: 'xyz-diagnostics',
  languageId: 'xyz',
  provideDiagnostics(textDocument, offset) {
    return [
      {
        rowIndex: 1,
        columnIndex: 1,
        endRowIndex: 1,
        endColumnIndex: 4,
        message: 'error',
        type: 'error',
      },
    ]
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
