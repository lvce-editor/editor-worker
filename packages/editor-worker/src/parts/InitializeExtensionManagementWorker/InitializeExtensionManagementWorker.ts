import { createExtensionManagementWorkerRpc } from '../CreateExtensionManagementWorkerRpc/CreateExtensionManagementWorkerRpc.ts'

export const initializeExtensionManagementWorker = async (): Promise<void> => {
  const rpc = await createExtensionManagementWorkerRpc()
  ExtensionManagementWorker.set(rpc)
}
