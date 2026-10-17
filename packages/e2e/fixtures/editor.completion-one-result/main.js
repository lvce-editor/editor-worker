import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

const provider = {
  id: 'xyz-completion',
  languageId: 'xyz',
  provideCompletions(textDocument, offset) {
    return [
      {
        type: 1,
        label: 'test',
      },
    ]
  },
  resolveCompletionItem(textDocument, offset, name, completionItem) {
    return undefined
  },
}

await activateExtensionApi()
registerCompletionProvider(provider)
