import * as CreateSyntaxHighlightingWorkerRpc from '../CreateSyntaxHighlightingWorkerRpc/CreateSyntaxHighlightingWorkerRpc.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

export const initializeSyntaxHighlighting = async (syntaxHighlightingEnabled: boolean, syncIncremental: boolean): Promise<void> => {
  if (syntaxHighlightingEnabled) {
    SyntaxHighlightingState.setEnabled(true)
    const syntaxRpc = await CreateSyntaxHighlightingWorkerRpc.createSyntaxHighlightingWorkerRpc()
    SyntaxHighlightingWorker.set(syntaxRpc)
  }
  if (syncIncremental) {
    SyncIncremental.setEnabled(true)
  }
}
