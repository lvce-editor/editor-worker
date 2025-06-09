import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToSyntaxHighlightingWorker = async (): Promise<MessagePort> => {
  try {
    const { port1, port2 } = GetPortTuple.getPortTuple()

    await RendererWorker.invokeAndTransfer(
      // @ts-ignore
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
      port1,
      'HandleMessagePort.handleMessagePort2',
    )
    return port2
  } catch {
    const { port1, port2 } = GetPortTuple.getPortTuple()
    await RendererWorker.invokeAndTransfer(
      // @ts-ignore
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
      port1,
      'HandleMessagePort.handleMessagePort',
    )
    return port2
  }
}
