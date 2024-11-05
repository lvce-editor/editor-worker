import * as Promises from '../Promises/Promises.ts'

export const waitForFirstMessage = async (port: MessagePort): Promise<MessageEvent> => {
  const { resolve, promise } = Promises.withResolvers<MessageEvent>()
  const cleanup = (value: MessageEvent) => {
    port.onmessage = null
    resolve(value)
  }
  const handleMessage = (event: MessageEvent) => {
    cleanup(event)
  }
  port.onmessage = handleMessage
  const event = await promise
  return event
}
