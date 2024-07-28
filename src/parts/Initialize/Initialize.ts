import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as SyncIncremental from '../SyncIncremental/SyncIncremental.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean, syncIncremental: boolean) => {
  await RendererProcess.listen()
  if (syntaxHighlightingEnabled) {
    SyntaxHighlightingState.setEnabled(true)
    await SyntaxHighlightingWorker.listen()
  }
  if (syncIncremental) {
    SyncIncremental.setEnabled(true)
  }
  await ExtensionHostWorker.listen()
}
