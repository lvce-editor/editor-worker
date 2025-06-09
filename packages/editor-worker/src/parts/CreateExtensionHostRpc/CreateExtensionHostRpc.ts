import { type Rpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { RpcId } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import { sendMessagePortToExtensionHostWorker2 } from '../SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.ts'

export const createExtensionHostRpc = async (): Promise<Rpc> => {
  try {
    const { port1, port2 } = GetPortTuple.getPortTuple()
    const initialCommand = 'HandleMessagePort.handleMessagePort2'
    await sendMessagePortToExtensionHostWorker2(port2, initialCommand, RpcId.EditorWorker)
    const rpc = await PlainMessagePortRpcParent.create({
      commandMap: {},
      messagePort: port1,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create extension host rpc`)
  }
}
