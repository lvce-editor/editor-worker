import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

const provider = {
  id: 'xyz-hover',
  languageId: 'xyz',
  provideHover(textDocument, offset) {
    if (textDocument.uri.endsWith('/empty.xyz')) {
      return {}
    }
    return {
      text: 'abc',
      documentation: offset === 11 ? 'def' : offset < 5 ? 'first' : 'second',
    }
  },
}

await activateExtensionApi()
registerHoverProvider(provider)
