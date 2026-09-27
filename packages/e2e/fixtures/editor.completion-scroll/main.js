import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

const provider = {
  id: 'xyz-completion',
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

await activateExtensionApi()
registerCompletionProvider(provider)
