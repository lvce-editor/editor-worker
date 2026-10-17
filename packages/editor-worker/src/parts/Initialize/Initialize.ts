import { setFactory } from '../CompletionWorker/CompletionWorker.ts'
import { initializeSyntaxHighlighting } from '../InitializeSyntaxHighlighting/InitializeSyntaxHighlighting.ts'
import { launchCompletionWorker } from '../LaunchCompletionWorker/LaunchCompletionWorker.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean, syncIncremental: boolean) => {
  setFactory(launchCompletionWorker)
  await initializeSyntaxHighlighting(syntaxHighlightingEnabled, syncIncremental)
}
