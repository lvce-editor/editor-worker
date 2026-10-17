import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../EditorStates/EditorStates.ts'
import { initializeDragAndDropWorker } from '../InitializeDragAndDropWorker/InitializeDragAndDropWorker.ts'
import { initializeErrorWorker } from '../InitializeErrorWorker/InitializeErrorWorker.ts'
import { initializeExtensionManagementWorker } from '../InitializeExtensionManagementWorker/InitializeExtensionManagementWorker.ts'
import { initializeOpenerWorker } from '../InitializeOpenerWorker/InitializeOpenerWorker.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/InitializeRendererWorker.ts'
import { initializeTextMeasurementWorker } from '../InitializeTextMeasurementWorker/InitializeTextMeasurementWorker.ts'

export const listen = async () => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([
    initializeRendererWorker(),
    initializeDragAndDropWorker(),
    initializeErrorWorker(),
    initializeExtensionManagementWorker(),
    initializeTextMeasurementWorker(),
    initializeOpenerWorker(),
  ])
  const dialogRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: RendererWorker.sendMessagePortToDialogWorker,
  })
  DialogWorker.set(dialogRpc)
}
