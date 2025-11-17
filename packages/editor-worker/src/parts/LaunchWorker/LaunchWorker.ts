import type { Rpc } from '@lvce-editor/rpc-registry'
import { MessagePortRpcParent } from '@lvce-editor/rpc'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'

export const launchWorker = async (name: string, url: string, intializeCommand?: string): Promise<Rpc> => {
  // TODO use transferMessagePortRpc
  const { port1, port2 } = GetPortTuple.getPortTuple()
  // @ts-ignore
  await RendererWorker.invokeAndTransfer('IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name: name,
    raw: true,
    port: port1,
  })
  const rpc = await MessagePortRpcParent.create({
    commandMap: {},
    messagePort: port2,
    isMessagePortOpen: true,
  })
  port2.start()
  if (intializeCommand) {
    await rpc.invoke(intializeCommand)
  }
  return rpc
}
