import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const { listen, invoke, invokeAndTransfer } = CreateRpc.createRpc(IpcParentType.ExtensionHostWorker)
