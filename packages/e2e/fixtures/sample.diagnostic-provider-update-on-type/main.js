const diagnosticProvider = {
  languageId: 'xyz',
  provideDiagnostics(textDocument, offset) {
    // TODO the range of the diagnostic should match the text length in the editor
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

export const activate = () => {
  vscode.registerDiagnosticProvider(diagnosticProvider)
}
