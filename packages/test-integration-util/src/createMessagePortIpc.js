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

  const getResponse = async (message) => {
    if (message.method) {
      const fn = commandMap[message.method]
      if (!fn) {
        return {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: `Command ${message.method} not found`,
          },
        }
      }
      const result = await fn(...message.params)
      return {
        jsonrpc: '2.0',
        result,
        id: message.id,
      }
    }
  }

  port.addEventListener('message', async (event) => {
    const message = event.data
    if (message.method) {
      const response = await getResponse(message)
      port.postMessage(response)
    } else {
      JsonRpc.resolve(message.id, message)
    }
  })
  return ipc
}
