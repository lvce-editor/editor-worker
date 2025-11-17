import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToSyntaxHighlightingWorker = async (port: MessagePort): Promise<void> => {
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
