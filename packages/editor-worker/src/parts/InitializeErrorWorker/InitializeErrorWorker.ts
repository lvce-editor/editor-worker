import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ErrorWorker, RendererWorker, RpcId } from '@lvce-editor/rpc-registry'

export const initializeErrorWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send(port) {
      return RendererWorker.sendMessagePortToErrorWorker(port, RpcId.EditorWorker)
    },
  })
  ErrorWorker.set(rpc)
}
