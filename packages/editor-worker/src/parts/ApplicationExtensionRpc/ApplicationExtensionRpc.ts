import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const invoke = async (applicationId: string | undefined, method: string, ...args: readonly unknown[]): Promise<any> => {
  return applicationId === undefined
    ? ExtensionManagementWorker.invoke(method, ...args)
    : ExtensionManagementWorker.invoke('Extensions.invokeForApplication', applicationId, method, ...args)
}

export const invokeAndTransfer = async (applicationId: string | undefined, method: string, ...args: readonly unknown[]): Promise<any> => {
  return applicationId === undefined
    ? ExtensionManagementWorker.invokeAndTransfer(method, ...args)
    : ExtensionManagementWorker.invokeAndTransfer('Extensions.invokeForApplication', applicationId, method, ...args)
}
