const provider = {
  languageId: 'xyz',
  provideHover(textDocument, offset) {
    return {
      text: 'abc',
    }
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerHoverProvider(provider)
}
