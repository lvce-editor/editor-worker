import { activate as activateExtensionApi, registerCommand, registerDefinitionProvider } from '@lvce-editor/api'

const started = Promise.withResolvers()
const active = Promise.withResolvers()
const offsets = []
await activateExtensionApi()
registerCommand({ id: 'altHoverBacklog.waitForStart', execute: () => started.promise })
registerCommand({ id: 'altHoverBacklog.release', execute: () => active.resolve() })
registerCommand({ id: 'altHoverBacklog.offsets', execute: () => offsets })
registerDefinitionProvider({
  id: 'alt-hover-backlog',
  languageId: 'alt-hover-backlog',
  async provideDefinition(document, offset) {
    offsets.push(offset)
    if (offsets.length === 1) {
      started.resolve()
      await active.promise
    }
    return { uri: document.uri, startOffset: 0, endOffset: 6 }
  },
})
