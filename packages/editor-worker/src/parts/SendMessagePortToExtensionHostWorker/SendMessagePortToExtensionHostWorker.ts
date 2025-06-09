import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToExtensionHostWorker = async (port: MessagePort): Promise<void> => {
  // @ts-ignore
  await RendererWorker.invokeAndTransfer(
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker',
    port,
    'HandleMessagePort.handleMessagePort',
  )
}

export const sendMessagePortToExtensionHostWorker2 = async (port: MessagePort, initialCommand: string, rpcId: number): Promise<void> => {
  await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker', port, initialCommand, rpcId)
}
