const provider = {
  languageId: 'xyz',
  provideHover(textDocument, offset) {
    return {
      text: 'abc',
      documentation: 'def',
    }
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerHoverProvider(provider)
}
