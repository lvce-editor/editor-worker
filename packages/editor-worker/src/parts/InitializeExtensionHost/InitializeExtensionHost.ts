import * as CreateExtensionHostRpc from '../CreateExtensionHostRpc/CreateExtensionHostRpc.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

export const initializeExtensionHost = async (): Promise<void> => {
  const extensionHostRpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  ExtensionHostWorker.set(extensionHostRpc)
}
