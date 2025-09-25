const diagnosticProvider = {
  languageId: 'xyz',
  provideDiagnostics(textDocument, offset) {
    throw new TypeError(`x is not a function`)
  },
}

export const activate = () => {
  vscode.registerDiagnosticProvider(diagnosticProvider)
}
