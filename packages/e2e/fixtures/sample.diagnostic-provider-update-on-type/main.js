import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

const diagnosticProvider = {
  id: 'xyz-diagnostics',
  languageId: 'xyz',
  provideDiagnostics(textDocument) {
    const { text } = textDocument
    return [
      {
        rowIndex: 0,
        columnIndex: 0,
        endRowIndex: 0,
        endColumnIndex: 1,
        message: JSON.stringify(text),
        type: 'error',
      },
    ]
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
