import { activate as activateExtensionApi, registerCommand, registerHoverProvider } from '@lvce-editor/api'

const requests = []
const waiters = []
await activateExtensionApi()
registerHoverProvider({
  id: 'pending-hover',
  languageId: 'pending-hover',
  provideHover() {
    const request = Promise.withResolvers()
    requests.push(request)
    for (const waiter of waiters.splice(0)) {
      waiter()
    }
    return request.promise
  },
})
registerCommand({
  id: 'pendingHover.wait',
  execute() {
    if (requests.length) {
      return
    }
    return new Promise((resolve) => waiters.push(resolve))
  },
})
registerCommand({
  id: 'pendingHover.resolve',
  execute() {
    for (const request of requests.splice(0)) {
      request.resolve({ documentation: 'resolved hover' })
    }
  },
})
