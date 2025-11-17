import { type Rpc, TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RpcId } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'
import { sendMessagePortToExtensionHostWorker2 } from '../SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.ts'

export const createExtensionHostRpc = async (): Promise<Rpc> => {
  try {
    const initialCommand = 'HandleMessagePort.handleMessagePort2'
    const rpc = await TransferMessagePortRpcParent.create({
      commandMap: {},
      async send(port) {
        await sendMessagePortToExtensionHostWorker2(port, initialCommand, RpcId.EditorWorker)
      },
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create extension host rpc`)
  }
}
