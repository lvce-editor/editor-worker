const organizeImports = {
  kind: 'source.organizeImports', // TODO use numeric code action type
  name: 'Organize Imports',
  async execute(textDocument) {
    // TODO
    return [
      {
        offset: 0,
        inserted: 'let x =1',
        deleted: 100,
      },
    ]
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
