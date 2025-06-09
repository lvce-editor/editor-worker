import * as CreateExtensionHostRpc from '../CreateExtensionHostRpc/CreateExtensionHostRpc.ts'
import * as CreateSyntaxHighlightingWorkerRpc from '../CreateSyntaxHighlightingWorkerRpc/CreateSyntaxHighlightingWorkerRpc.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean, syncIncremental: boolean) => {
  if (syntaxHighlightingEnabled) {
    SyntaxHighlightingState.setEnabled(true)
    const syntaxRpc = await CreateSyntaxHighlightingWorkerRpc.createSyntaxHighlightingWorkerRpc()
    SyntaxHighlightingWorker.set(syntaxRpc)
  }
  if (syncIncremental) {
    SyncIncremental.setEnabled(true)
  }
  const extensionHostRpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  ExtensionHostWorker.set(extensionHostRpc)
}
