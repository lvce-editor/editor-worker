import { activate as activateExtensionApi, registerCodeActionsProvider } from '@lvce-editor/api'

const organizeImports = {
  kind: 'source.organizeImports', // TODO use numeric code action type
  name: 'Organize Imports',
}

Object.defineProperty(organizeImports, 'execute', {
  enumerable: false,
  async value(textDocument) {
    return [
      {
        startOffset: 0,
        endOffset: 100,
        inserted: `import { add } from './add.xyz'`,
      },
    ]
  },
})

const codeActionProvider = {
  id: 'xyz-code-actions',
  languageId: 'xyz',
  async provideCodeActions() {
    return [organizeImports]
  },
}

await activateExtensionApi()
registerCodeActionsProvider(codeActionProvider)
