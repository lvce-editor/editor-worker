import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToRendererProcess = async (port: MessagePort) => {
  await RendererWorker.invokeAndTransfer(
    // @ts-ignore
    'SendMessagePortToRendererProcess.sendMessagePortToRendererProcess',
    port,
    'HandleMessagePort.handleMessagePort',
  )
}
