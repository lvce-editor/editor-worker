import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../EditorStates/EditorStates.ts'
import { initializeExtensionHost } from '../InitializeExtensionHost/InitializeExtensionHost.ts'
import { initializeExtensionManagementWorker } from '../InitializeExtensionManagementWorker/InitializeExtensionManagementWorker.ts'
import { initializeOpenerWorker } from '../InitializeOpenerWorker/InitializeOpenerWorker.ts'
import { initializeTextMeasurementWorker } from '../InitializeTextMeasurementWorker/InitializeTextMeasurementWorker.ts'

export const listen = async () => {
  registerCommands(CommandMap.commandMap)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rpc)
  await Promise.all([initializeExtensionHost(), initializeExtensionManagementWorker(), initializeTextMeasurementWorker(), initializeOpenerWorker()])
}
