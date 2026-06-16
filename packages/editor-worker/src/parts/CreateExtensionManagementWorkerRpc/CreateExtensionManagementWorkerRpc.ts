import { type Rpc, LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker, RpcId } from '@lvce-editor/rpc-registry'

export const createExtensionManagementWorkerRpc = async (): Promise<Rpc> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port) {
      await RendererWorker.sendMessagePortToExtensionManagementWorker(port, RpcId.EditorWorker)
    },
  })
  return rpc
}
