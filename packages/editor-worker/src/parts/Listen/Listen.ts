import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../EditorStates/EditorStates.ts'
import { initializeCacheWorker } from '../InitializeCacheWorker/InitializeCacheWorker.ts'
import { initializeDragAndDropWorker } from '../InitializeDragAndDropWorker/InitializeDragAndDropWorker.ts'
import { initializeErrorWorker } from '../InitializeErrorWorker/InitializeErrorWorker.ts'
import { initializeExtensionManagementWorker } from '../InitializeExtensionManagementWorker/InitializeExtensionManagementWorker.ts'

export const listen = async () => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([
    RendererWorker.initializeRendererWorkerForWorker(CommandMap.commandMap),
    initializeDragAndDropWorker(),
    initializeErrorWorker(),
    initializeExtensionManagementWorker(),
    RendererWorker.initializeTextMeasurementWorker(),
    initializeCacheWorker(),
    RendererWorker.initializeOpenerWorker(),
  ])
  const dialogRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: RendererWorker.sendMessagePortToDialogWorker,
  })
  DialogWorker.set(dialogRpc)
}
