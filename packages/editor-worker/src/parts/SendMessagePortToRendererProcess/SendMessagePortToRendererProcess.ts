import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToRendererProcess = async (port: MessagePort) => {
  await RendererWorker.invokeAndTransfer(
    // @ts-ignore
    'SendMessagePortToRendererProcess.sendMessagePortToRendererProcess',
    port,
    'HandleMessagePort.handleMessagePort',
  )
}
