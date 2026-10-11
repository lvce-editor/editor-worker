import { activate as activateExtensionApi, registerCompletionProvider, registerDiagnosticProvider } from '@lvce-editor/api'

const completionProvider = {
  id: 'xyz-completion',
  languageId: 'xyz',
  provideCompletions() {
    return [
      {
        type: 1,
        label: 'badGood',
      },
    ]
  },
}

const diagnosticProvider = {
  id: 'xyz-diagnostics',
  languageId: 'xyz',
  provideDiagnostics(textDocument) {
    const diagnostics = [
      {
        rowIndex: 1,
        columnIndex: 0,
        endRowIndex: 1,
        endColumnIndex: 1,
        message: 'Unrelated diagnostic',
        type: 'error',
      },
    ]
    if (textDocument.text.startsWith('bad\n')) {
      diagnostics.unshift({
        rowIndex: 0,
        columnIndex: 0,
        endRowIndex: 0,
        endColumnIndex: 3,
        message: 'Stale diagnostic',
        type: 'error',
      })
    }
    if (textDocument.text.startsWith('badGood!\n')) {
      diagnostics.push({
        rowIndex: 0,
        columnIndex: 7,
        endRowIndex: 0,
        endColumnIndex: 8,
        message: 'Typing diagnostic',
        type: 'error',
      })
    }
    return diagnostics
  },
}

await activateExtensionApi()
registerCompletionProvider(completionProvider)
registerDiagnosticProvider(diagnosticProvider)
