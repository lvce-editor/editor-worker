import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  return RendererWorker.sendMessagePortToTextMeasurementWorker(port)
}

export const initializeTextMeasurementWorker = async (): Promise<void> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send,
    })
    TextMeasurementWorker.set(rpc)
  } catch {
    // ignore
  }
}
