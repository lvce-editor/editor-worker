import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

const diagnosticProvider = {
  id: 'xyz-diagnostics',
  languageId: 'xyz',
  provideDiagnostics(textDocument, offset) {
    throw new TypeError(`x is not a function`)
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
