import type { Rpc } from '@lvce-editor/rpc-registry'
import { TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'

export const launchWorker = async (name: string, url: string, intializeCommand?: string): Promise<Rpc> => {
  const rpc = await TransferMessagePortRpcParent.create({
    commandMap: {},
    isMessagePortOpen: true,
    async send(port) {
      await RendererWorker.invokeAndTransfer('IpcParent.create', {
        method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
        name,
        port,
        raw: true,
        url,
      })
    },
  })
  if (intializeCommand) {
    await rpc.invoke(intializeCommand)
  }
  return rpc
}
