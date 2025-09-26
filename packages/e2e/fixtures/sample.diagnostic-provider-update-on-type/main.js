const diagnosticProvider = {
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

export const activate = () => {
  vscode.registerDiagnosticProvider(diagnosticProvider)
}
