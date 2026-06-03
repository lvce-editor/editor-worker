import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToExtensionManagementWorker = async (port: MessagePort, rpcId: number): Promise<void> => {
  await RendererWorker.sendMessagePortToExtensionManagementWorker(port, rpcId)
}
