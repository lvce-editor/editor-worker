import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToSyntaxHighlightingWorker = async (port: MessagePort) => {
  try {
    await RendererWorker.invokeAndTransfer(
      // @ts-ignore
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
      port,
      'HandleMessagePort.handleMessagePort2',
    )
  } catch {
    await RendererWorker.invokeAndTransfer(
      // @ts-ignore
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
      port,
      'HandleMessagePort.handleMessagePort',
    )
  }
}
