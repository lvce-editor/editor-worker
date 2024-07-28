import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

export const intialize = async (syntaxHighlightingEnabled: boolean) => {
  await RendererProcess.listen()
  if (syntaxHighlightingEnabled) {
    await SyntaxHighlightingWorker.listen()
  }
  await ExtensionHostWorker.listen()
}
