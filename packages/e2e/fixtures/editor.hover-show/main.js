import { activate as activateExtensionApi, registerHoverProvider } from '@lvce-editor/api'

let initialHoverReturned = false

const provider = {
  id: 'xyz-hover',
  languageId: 'xyz',
  provideHover(textDocument, offset) {
    if (textDocument.uri.endsWith('/empty.xyz')) {
      return {}
    }
    if (offset < 5 && !initialHoverReturned) {
      initialHoverReturned = true
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
