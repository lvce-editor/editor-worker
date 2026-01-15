import { setFactory } from '../CompletionWorker/CompletionWorker.ts'
import { initializeExtensionHost } from '../InitializeExtensionHost/InitializeExtensionHost.ts'
import { initializeExtensionManagementWorker } from '../InitializeExtensionManagementWorker/InitializeExtensionManagementWorker.ts'
import { initializeSyntaxHighlighting } from '../InitializeSyntaxHighlighting/InitializeSyntaxHighlighting.ts'
import { initializeTextMeasurementWorker } from '../InitializeTextMeasurementWorker/InitializeTextMeasurementWorker.ts'
import { launchCompletionWorker } from '../LaunchCompletionWorker/LaunchCompletionWorker.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean, syncIncremental: boolean) => {
  setFactory(launchCompletionWorker)
  await Promise.all([
    initializeSyntaxHighlighting(syntaxHighlightingEnabled, syncIncremental),
    initializeExtensionHost(),
    initializeExtensionManagementWorker(),
    initializeTextMeasurementWorker(),
  ])
}
