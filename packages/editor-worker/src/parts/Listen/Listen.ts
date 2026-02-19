import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { createTextMeasurementWorkerRpc } from '../CreateTextMeasurementWorkerRpc/CreateTextMeasurementWorkerRpc.ts'
import { registerCommands } from '../EditorStates/EditorStates.ts'
import { setFactory } from '../TextMeasurementWorker/TextMeasurementWorker.ts'

export const listen = async () => {
  registerCommands(CommandMap.commandMap)
  setFactory(createTextMeasurementWorkerRpc)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rpc)
}
