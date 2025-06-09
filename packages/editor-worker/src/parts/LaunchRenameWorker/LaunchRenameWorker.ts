import { MessagePortRpcParent } from '@lvce-editor/rpc'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'

export const launchRenameWorker = async () => {
  const name = 'Rename Worker'
  const { port1, port2 } = GetPortTuple.getPortTuple()
  // @ts-ignore
  await RendererWorker.invokeAndTransfer('IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: 'renameWorkerMain.js',
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
  return rpc
}
