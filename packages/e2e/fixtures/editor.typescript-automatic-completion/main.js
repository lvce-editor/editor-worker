import { activate, registerCompletionProvider } from '@lvce-editor/api'

await activate()
registerCompletionProvider({
  id: 'typescript-automatic-test',
  languageId: 'typescript',
  provideCompletions(document, offset) {
    const prefix = document.text.slice(0, offset)
    return [{ type: 1, label: prefix.endsWith('obj.') ? 'member' : 'value' }]
  },
})
