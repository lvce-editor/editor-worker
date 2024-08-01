import * as JsonRpc from '@lvce-editor/json-rpc'

export const createMessagePortIpc = async (listener, commandMap) => {
  const { port1, port2 } = new MessageChannel()
  listener({
    data: {
      method: 'initialize',
      params: ['message-port', port1],
    },
  })

  const ipc = {
    send(message) {
      console.log({ message })
      port2.postMessage(message)
    },
    dispose() {
      port2.close()
      process.exit(0)
    },
  }
  port2.addEventListener('message', async (event) => {
    const message = event.data
    console.log({ message })
    if (message.method) {
      const fn = commandMap[message.method]
      if (!fn) {
        throw new Error(`command ${message.method} not found`)
      }
      const result = await fn(...message.params)
      port2.postMessage({
        jsonrpc: '2.0',
        result,
        id: message.id,
      })
    } else {
      JsonRpc.resolve(message.id, message)
    }
  })
  return ipc
}
