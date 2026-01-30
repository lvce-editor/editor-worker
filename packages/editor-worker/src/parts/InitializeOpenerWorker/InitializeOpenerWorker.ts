import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { MainAreaWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  // @ts-ignore
  return RendererWorker.sendMessagePortToMainAreaWorker(port)
}

export const initializeOpenerWorker = async (): Promise<void> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send,
    })
    MainAreaWorker.set(rpc)
  } catch {
    // ignore
  }
}
