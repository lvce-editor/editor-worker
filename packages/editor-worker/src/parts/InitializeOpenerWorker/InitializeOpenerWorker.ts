import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { OpenerWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
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
