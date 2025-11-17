import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToExtensionHostWorker2 = async (port: MessagePort, initialCommand: string, rpcId: number): Promise<void> => {
  await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker', port, initialCommand, rpcId)
}
