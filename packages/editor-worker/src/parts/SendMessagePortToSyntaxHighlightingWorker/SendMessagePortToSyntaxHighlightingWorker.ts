import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToSyntaxHighlightingWorker = async (port: MessagePort) => {
  await RendererWorker.invokeAndTransfer(
    'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
    port,
    'HandleMessagePort.handleMessagePort',
  )
}
