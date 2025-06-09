import { initializeExtensionHost } from '../InitializeExtensionHost/InitializeExtensionHost.ts'
import { initializeSyntaxHighlighting } from '../InitializeSyntaxHighlighting/InitializeSyntaxHighlighting.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean, syncIncremental: boolean) => {
  await Promise.all([initializeSyntaxHighlighting(syntaxHighlightingEnabled, syncIncremental), initializeExtensionHost()])
}
