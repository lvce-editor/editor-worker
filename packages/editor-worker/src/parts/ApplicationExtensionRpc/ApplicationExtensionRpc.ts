import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const invoke = async (applicationId: string | undefined, method: string, ...args: readonly unknown[]): Promise<any> => {
  return applicationId === undefined
    ? ExtensionManagementWorker.invoke(method, ...args)
    : ExtensionManagementWorker.invoke('Extensions.invokeForApplication', applicationId, method, ...args)
}
