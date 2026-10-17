import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'

export const initializeDragAndDropWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: RendererWorker.sendMessagePortToDragAndDropWorker,
  })
  DragAndDropWorker.set(rpc)
}
