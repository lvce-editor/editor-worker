import { type Rpc, PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'
import * as SendMessagePortToSyntaxHighlightingWorker from '../SendMessagePortToSyntaxHighlightingWorker/SendMessagePortToSyntaxHighlightingWorker.ts'

export const createSyntaxHighlightingWorkerRpc = async (): Promise<Rpc> => {
  try {
    const port = await SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker()
    const rpc = await PlainMessagePortRpcParent.create({
      commandMap: {},
      messagePort: port,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create syntax highlighting worker rpc`)
  }
}
