import { setFactory } from '../CompletionWorker/CompletionWorker.ts'
import { initializeExtensionHost } from '../InitializeExtensionHost/InitializeExtensionHost.ts'
import { initializeSyntaxHighlighting } from '../InitializeSyntaxHighlighting/InitializeSyntaxHighlighting.ts'
import { launchCompletionWorker } from '../LaunchCompletionWorker/LaunchCompletionWorker.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean, syncIncremental: boolean) => {
  setFactory(launchCompletionWorker)
  await Promise.all([initializeSyntaxHighlighting(syntaxHighlightingEnabled, syncIncremental), initializeExtensionHost()])
}
