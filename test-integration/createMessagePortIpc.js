import * as JsonRpc from '@lvce-editor/json-rpc'

export const createMessagePortIpc = async (listener) => {
  const { port1, port2 } = new MessageChannel()
  listener({
    data: {
      method: 'initialize',
      params: ['message-port', port1],
    },
  })

  const promise = new Promise((resolve) => {
    port2.addEventListener('message', resolve, {
      once: true,
    })
  })

  const ipc = {
    send(message) {
      console.log({ message })
      port2.postMessage(message)
    },
  }
  await promise
  port2.addEventListener('message', (event) => {
    const message = event.data
    console.log({ message })
    JsonRpc.resolve(message.id, message)
  })
  return ipc
}
