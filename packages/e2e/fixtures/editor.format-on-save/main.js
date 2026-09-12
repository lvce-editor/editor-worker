import { activate as activateExtensionApi, registerFormattingProvider } from '@lvce-editor/api'

await activateExtensionApi()
registerFormattingProvider({
  id: 'format-test',
  languageId: 'format-test',
  format(document) {
    return [{ startOffset: 0, endOffset: document.text.length, inserted: JSON.stringify(JSON.parse(document.text), null, 2) + '\n' }]
  },
})
