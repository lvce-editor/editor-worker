import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

const sentLines = Object.create(null)

export const resetSentLines = (id: number) => {
  delete sentLines[id]
}

// TODO only send changed lines to renderer process instead of all lines in viewport
export const getTokensViewport2 = async (editor: any, startLineIndex: any, endLineIndex: any, syncIncremental: boolean) => {
  if (editor.languageId === 'html') {
    return GetTokensViewport.getTokensViewport(editor, startLineIndex, endLineIndex)
  }
  if (SyntaxHighlightingState.getEnabled()) {
    if (syncIncremental) {
      const { id, invalidStartIndex, languageId, lines } = editor
      let hasLinesToSend = true
      let linesToSend = lines
      if (sentLines[id] === lines) {
        hasLinesToSend = false
        linesToSend = []
      } else {
        sentLines[id] = lines
      }
      const slimEditor = {
        invalidStartIndex,
        languageId,
      }
      return SyntaxHighlightingWorker.invoke(
        'GetTokensViewport.getTokensViewport',
        slimEditor,
        // @ts-ignore
        startLineIndex,
        endLineIndex,
        hasLinesToSend,
        id,
        linesToSend,
      )
    }
    // TODO only send needed lines of text
    // @ts-ignore
    return SyntaxHighlightingWorker.invoke('GetTokensViewport.getTokensViewport', editor, startLineIndex, endLineIndex, true, editor.id, editor.lines)
  }
  return GetTokensViewport.getTokensViewport(editor, startLineIndex, endLineIndex)
}
