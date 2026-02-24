import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

const lineArrayToken = Symbol('lineArrayToken')
const sentLineTokens = Object.create(null)
let nextLineArrayToken = 1

const getLineArrayToken = (lines: readonly string[]) => {
  const existingToken = (lines as any)[lineArrayToken]
  if (existingToken) {
    return existingToken
  }
  const token = nextLineArrayToken++
  Object.defineProperty(lines, lineArrayToken, {
    configurable: false,
    enumerable: false,
    value: token,
    writable: false,
  })
  return token
}

// TODO only send changed lines to renderer process instead of all lines in viewport
export const getTokensViewport2 = async (editor: any, startLineIndex: any, endLineIndex: any, syncIncremental: boolean) => {
  if (SyntaxHighlightingState.getEnabled()) {
    if (syncIncremental) {
      const { id, invalidStartIndex, languageId, lines } = editor
      const lineToken = getLineArrayToken(lines)
      let hasLinesToSend = true
      let linesToSend = lines
      if (sentLineTokens[id] === lineToken) {
        hasLinesToSend = false
        linesToSend = []
      } else {
        sentLineTokens[id] = lineToken
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
