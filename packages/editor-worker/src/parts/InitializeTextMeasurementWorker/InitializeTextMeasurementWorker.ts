import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  // @ts-ignore
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
