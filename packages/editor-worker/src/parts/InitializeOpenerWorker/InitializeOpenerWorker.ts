import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { OpenerWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  // @ts-ignore
  return RendererWorker.sendMessagePortToOpenerWorker(port)
}

export const initializeOpenerWorker = async (): Promise<void> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send,
    })
    OpenerWorker.set(rpc)
  } catch {
    // ignore
  }
}
