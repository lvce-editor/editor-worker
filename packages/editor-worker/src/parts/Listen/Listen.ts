import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../EditorStates/EditorStates.ts'
import { initializeExtensionHost } from '../InitializeExtensionHost/InitializeExtensionHost.ts'
import { initializeExtensionManagementWorker } from '../InitializeExtensionManagementWorker/InitializeExtensionManagementWorker.ts'
import { initializeOpenerWorker } from '../InitializeOpenerWorker/InitializeOpenerWorker.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/InitializeRendererWorker.ts'
import { initializeTextMeasurementWorker } from '../InitializeTextMeasurementWorker/InitializeTextMeasurementWorker.ts'

export const listen = async () => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([
    initializeRendererWorker(),
    initializeExtensionHost(),
    initializeExtensionManagementWorker(),
    initializeTextMeasurementWorker(),
    initializeOpenerWorker(),
  ])
}
