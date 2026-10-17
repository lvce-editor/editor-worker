import { PlainMessagePortRpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import * as DirectEditorEvents from '../DirectEditorEvents/DirectEditorEvents.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
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

export const handleDirectMessagePort = async (port: MessagePort, commands: Readonly<Record<string, unknown>>): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: DirectEditorEvents.createCommandMap(commands),
    messagePort: port,
  })
  RendererProcess.set(rpc)
}
