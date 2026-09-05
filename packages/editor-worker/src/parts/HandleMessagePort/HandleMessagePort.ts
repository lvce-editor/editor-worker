import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { initializeListener } from '../NotifyEditorStatusChange/NotifyEditorStatusChange.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const handleMessagePort = async (port: MessagePort, rpcId?: number) => {
  const rpc = await PlainMessagePortRpcParent.create({
    commandMap: {},
    messagePort: port,
  })
  if (rpcId) {
    RpcRegistry.set(rpcId, rpc)
    await initializeListener(rpcId)
  }
}
