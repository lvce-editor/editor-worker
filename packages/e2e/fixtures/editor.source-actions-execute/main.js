const organizeImports = {
  kind: 'source.organizeImports', // TODO use numeric code action type
  name: 'Organize Imports',
  async execute(textDocument) {
    // TODO
    return []
  },
}

const codeActionProvider = {
  languageId: 'xyz',
  async provideCodeActions() {
    return [organizeImports]
  },
}

export const activate = () => {
  // @ts-ignore
  vscode.registerCodeActionsProvider(codeActionProvider)
}
