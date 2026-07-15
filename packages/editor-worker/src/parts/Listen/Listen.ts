import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../EditorStates/EditorStates.ts'
import { initializeErrorWorker } from '../InitializeErrorWorker/InitializeErrorWorker.ts'
import { initializeExtensionHost } from '../InitializeExtensionHost/InitializeExtensionHost.ts'
import { initializeExtensionManagementWorker } from '../InitializeExtensionManagementWorker/InitializeExtensionManagementWorker.ts'
import { initializeOpenerWorker } from '../InitializeOpenerWorker/InitializeOpenerWorker.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/InitializeRendererWorker.ts'
import { initializeTextMeasurementWorker } from '../InitializeTextMeasurementWorker/InitializeTextMeasurementWorker.ts'

export const listen = async () => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([
    initializeRendererWorker(),
    initializeErrorWorker(),
    initializeExtensionHost(),
    initializeExtensionManagementWorker(),
    initializeTextMeasurementWorker(),
    initializeOpenerWorker(),
  ])
}
