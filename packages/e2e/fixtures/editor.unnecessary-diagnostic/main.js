import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

await activateExtensionApi()
registerDiagnosticProvider({
  id: 'xyz-diagnostics',
  languageId: 'xyz',
  provideDiagnostics() {
    return [
      {
        rowIndex: 0,
        columnIndex: 1,
        endRowIndex: 0,
        endColumnIndex: 4,
        message: 'unused variable',
        tags: [1],
        type: 'warning',
      },
    ]
  },
})
