import * as GetTokensViewport from '../GetTokensViewport/GetTokensViewport.ts'
import * as SyntaxHighlightingCache from '../SyntaxHighlightingCache/SyntaxHighlightingCache.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

// TODO only send changed lines to renderer process instead of all lines in viewport
const getFreshTokensViewport = async (editor: any, startLineIndex: any, endLineIndex: any, syncIncremental: boolean) => {
  const { lifecycle } = editor
  if (lifecycle?.disposed) {
    return { embeddedResults: [], tokenizersToLoad: [], tokens: [] }
  }
  if (SyntaxHighlightingState.getEnabled()) {
    if (syncIncremental) {
      const { id, invalidStartIndex, languageId, lines } = editor
      let hasLinesToSend = true
      let linesToSend = lines
      if (lifecycle?.sentLines === lines) {
        hasLinesToSend = false
        linesToSend = []
      } else if (lifecycle) {
        lifecycle.sentLines = lines
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

// Cached responses are rendering data, not tokenizer continuation state. A cache
// hit leaves both highlighters invalid from line zero so a later miss can safely
// reconstruct multiline and embedded state, even after edits or language changes.
export const getTokensViewport2 = async (editor: any, start: number, end: number, syncIncremental: boolean) => {
  if (editor.lifecycle?.disposed) {
    return { embeddedResults: [], tokenizersToLoad: [], tokens: [] }
  }
  // Preserve the original request/disposal ordering when caching is disabled.
  if (editor.syntaxHighlightingCacheEnabled !== true) {
    return getFreshTokensViewport(editor, start, end, syncIncremental)
  }
  const key = await SyntaxHighlightingCache.getKey(editor, start, end)
  if (editor.lifecycle?.disposed) {
    return { embeddedResults: [], tokenizersToLoad: [], tokens: [] }
  }
  if (key) {
    const cached = await SyntaxHighlightingCache.get(
      key,
      editor.lines.slice(start, end).map((line: string) => line.length),
    )
    if (editor.lifecycle?.disposed) {
      return { embeddedResults: [], tokenizersToLoad: [], tokens: [] }
    }
    if (cached) {
      editor.invalidStartIndex = 0
      editor.lineCache = []
      if (editor.lifecycle) {
        delete editor.lifecycle.sentLines
      }
      return cached
    }
  }
  const result = await getFreshTokensViewport(editor, start, end, syncIncremental)
  if (key && !editor.lifecycle?.disposed) {
    await SyntaxHighlightingCache.set(key, result)
  }
  return result
}
