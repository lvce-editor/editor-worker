import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

const provider = {
  id: 'xyz-hover',
  languageId: 'xyz',
  provideHover(textDocument, offset) {
    return {
      text: 'abc',
      documentation: 'def',
    }
  },
}

await activateExtensionApi()
registerHoverProvider(provider)
