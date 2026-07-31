import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

const diagnosticProvider = {
  id: 'javascript-diagnostics',
  languageId: 'javascript',
  provideDiagnostics(textDocument, offset) {
    return []
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
