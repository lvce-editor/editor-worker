import { type Rpc, TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker, RpcId } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'

export const createExtensionManagementWorkerRpc = async (): Promise<Rpc> => {
  try {
    const rpc = await TransferMessagePortRpcParent.create({
      commandMap: {},
      async send(port) {
        await RendererWorker.sendMessagePortToExtensionManagementWorker(port, RpcId.EditorWorker)
      },
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create extension management worker rpc`)
  }
}
