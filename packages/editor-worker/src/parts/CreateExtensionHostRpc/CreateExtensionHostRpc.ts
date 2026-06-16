import { type Rpc, LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RpcId } from '@lvce-editor/rpc-registry'
import { sendMessagePortToExtensionHostWorker2 } from '../SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.ts'

export const createExtensionHostRpc = async (): Promise<Rpc> => {
  const initialCommand = 'HandleMessagePort.handleMessagePort2'
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port) {
      await sendMessagePortToExtensionHostWorker2(port, initialCommand, RpcId.EditorWorker)
    },
  })
  return rpc
}
