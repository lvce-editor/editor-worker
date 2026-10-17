import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToExtensionManagementWorker = async (port: MessagePort, rpcId: number): Promise<void> => {
  await RendererWorker.sendMessagePortToExtensionManagementWorker(port, rpcId)
}

export const sendDeprecatedExtensionHostPortToExtensionManagementWorker = async (
  port: MessagePort,
  _initialCommand: string,
  rpcId: number,
): Promise<void> => {
  await RendererWorker.sendMessagePortToExtensionManagementWorker(port, rpcId)
}
