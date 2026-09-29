import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

await activateExtensionApi()
registerDiagnosticProvider({
  id: 'fast-pending-diagnostics',
  languageId: 'pending-diagnostics',
  async provideDiagnostics(textDocument) {
    return [
      {
        columnIndex: 0,
        endColumnIndex: 4,
        endRowIndex: 0,
        message: `Fast diagnostic for ${textDocument.uri}`,
        rowIndex: 0,
        type: 'warning',
      },
    ]
  },
})
