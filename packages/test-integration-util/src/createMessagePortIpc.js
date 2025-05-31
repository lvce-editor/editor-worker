import * as JsonRpc from '@lvce-editor/json-rpc'

export const createMessagePortIpc = async (port, commandMap) => {
  const ipc = {
    send(message) {
      port.postMessage(message)
    },
    dispose() {
      port.close()
      process.exit(0)
    },
  }
  port.addEventListener('message', async (event) => {
    const message = event.data
    if (message.method) {
      const fn = commandMap[message.method]
      if (!fn) {
        port.postMessage({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: `Command ${message.method} not found`,
          },
        })
        return
      }
      const result = await fn(...message.params)
      port.postMessage({
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
