import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

const diagnosticProvider = {
  id: 'xyz-diagnostics',
  languageId: 'xyz',
  provideDiagnostics(textDocument, offset) {
    const { text } = textDocument
    return [
      {
        rowIndex: 1,
        columnIndex: 1,
        endRowIndex: 1,
        endColumnIndex: text.length,
        message: 'error',
        type: 'error',
      },
    ]
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
