import { activate as activateExtensionApi, registerCompletionProvider } from '@lvce-editor/api'

let requestCount = 0

const provider = {
  id: 'xyz-completion',
  languageId: 'xyz',
  provideCompletions() {
    requestCount++
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve([{ type: 1, label: 'test' }])
        },
        requestCount === 1 ? 1500 : 0,
      )
    })
  },
  resolveCompletionItem() {
    return undefined
  },
}

await activateExtensionApi()
registerCompletionProvider(provider)
