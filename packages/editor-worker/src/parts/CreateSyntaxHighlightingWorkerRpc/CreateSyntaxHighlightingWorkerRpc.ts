import { type Rpc, TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'
import * as SendMessagePortToSyntaxHighlightingWorker from '../SendMessagePortToSyntaxHighlightingWorker/SendMessagePortToSyntaxHighlightingWorker.ts'

export const createSyntaxHighlightingWorkerRpc = async (): Promise<Rpc> => {
  try {
    const rpc = await TransferMessagePortRpcParent.create({
      commandMap: {},
      send: SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create syntax highlighting worker rpc`)
  }
}
