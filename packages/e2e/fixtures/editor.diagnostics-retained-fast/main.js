import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

await activateExtensionApi()
registerDiagnosticProvider({
  id: 'retained-fast-diagnostics',
  languageId: 'retained-diagnostics',
  provideDiagnostics(textDocument) {
    const firstLine = textDocument.text.split('\n')[0]
    return [
      {
        columnIndex: 0,
        endColumnIndex: firstLine.length,
        endRowIndex: 0,
        message: `Fast ${textDocument.text}`,
        rowIndex: 0,
        type: 'warning',
      },
    ]
  },
})
