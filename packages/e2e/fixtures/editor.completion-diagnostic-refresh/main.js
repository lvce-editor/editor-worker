import { activate as activateExtensionApi, registerCompletionProvider, registerDiagnosticProvider } from '@lvce-editor/api'

const completionProvider = {
  id: 'completion-diagnostic-refresh-completion',
  languageId: 'completiondiagnosticrefresh',
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
  id: 'completion-diagnostic-refresh-diagnostics',
  languageId: 'completiondiagnosticrefresh',
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
