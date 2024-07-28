import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean) => {
  await RendererProcess.listen()
  if (syntaxHighlightingEnabled) {
    SyntaxHighlightingState.setEnabled(true)
    await SyntaxHighlightingWorker.listen()
  }
  await ExtensionHostWorker.listen()
}
