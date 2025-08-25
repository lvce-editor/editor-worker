const provider = {
  languageId: 'xyz',
  provideCompletions(textDocument, offset) {
    return []
  },
  resolveCompletionItem(textDocument, offset, name, completionItem) {
    return {}
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerCompletionProvider(provider)
}
