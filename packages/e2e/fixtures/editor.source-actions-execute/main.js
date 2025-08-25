const organizeImports = {
  kind: 'source.organizeImports', // TODO use numeric code action type
  name: 'Organize Imports',
  async execute(textDocument) {
    return [
      {
        startOffset: 0,
        endOffset: 100,
        inserted: `import { add } from './add.xyz'`,
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
