const provider = {
  languageId: 'xyz',
  provideCompletions(textDocument, offset) {
    const items = []
    for (let i = 0; i < 100; i++) {
      items.push({
        type: 1,
        label: `test ${i}`,
      })
    }
    return items
  },
  resolveCompletionItem(textDocument, offset, name, completionItem) {
    return {}
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerCompletionProvider(provider)
}
