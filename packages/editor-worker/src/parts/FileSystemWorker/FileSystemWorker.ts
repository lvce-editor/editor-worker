import { type Rpc, TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const state: { rpcPromise?: Promise<Rpc> } = {}
const create = (): Promise<Rpc> =>
  TransferMessagePortRpcParent.create({
    commandMap: {},
    send: (port: MessagePort) =>
      RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port, 'FileSystem.connect'),
  })

export const invoke = async (method: string, ...args: readonly unknown[]): Promise<any> => {
  state.rpcPromise ||= create()
  let rpc: Rpc
  try {
    const { rpcPromise } = state
    rpc = await rpcPromise
  } catch (error) {
    delete state.rpcPromise
    throw error
  }
  return rpc.invoke(method, ...args)
}
