import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

// TODO only send changed lines to renderer process instead of all lines in viewport
export const getTokensViewport2 = (editor: any, startLineIndex: any, endLineIndex: any) => {
  if (SyntaxHighlightingState.getEnabled()) {
    // TODO only send needed lines of text
    return SyntaxHighlightingWorker.invoke('GetTokensViewport.getTokensViewport', editor, startLineIndex, endLineIndex)
  }
  return GetTokensViewport.getTokensViewport(editor, startLineIndex, endLineIndex)
}
