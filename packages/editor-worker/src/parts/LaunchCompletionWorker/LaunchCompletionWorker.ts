import { MessagePortRpcParent } from '@lvce-editor/rpc'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'

export const launchCompletionWorker = async () => {
  const name = 'Completion Worker'
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await RendererWorker.invokeAndTransfer('IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: 'completionWorkerMain.js',
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
  await rpc.invoke('Completions.initialize')
  return rpc
}
