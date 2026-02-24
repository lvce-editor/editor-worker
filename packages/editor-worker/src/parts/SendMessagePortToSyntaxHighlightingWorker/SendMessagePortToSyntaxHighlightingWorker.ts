import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToSyntaxHighlightingWorker = async (port: MessagePort): Promise<void> => {
  try {
    await RendererWorker.sendMessagePortToSyntaxHighlightingWorker(port)
  } catch {
    // deprecated
    await RendererWorker.invokeAndTransfer(
      // @ts-ignore
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
      port,
      'HandleMessagePort.handleMessagePort',
    )
  }
}
