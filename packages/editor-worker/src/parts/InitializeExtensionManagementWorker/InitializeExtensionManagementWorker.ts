import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { createExtensionManagementWorkerRpc } from '../CreateExtensionManagementWorkerRpc/CreateExtensionManagementWorkerRpc.ts'

export const initializeExtensionManagementWorker = async (): Promise<void> => {
  try {
    const rpc = await createExtensionManagementWorkerRpc()
    ExtensionManagementWorker.set(rpc)
  } catch {
    // ignore
  }
}
