import * as GetInitialLineState from '../GetInitialLineState/GetInitialLineState.ts'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.ts'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'
import * as Tokenizer from '../Tokenizer/Tokenizer.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

const getTokensViewportEmbedded = (langageId: string, lines: string[], lineCache: any, linesWithEmbed: any) => {
  const tokenizersToLoad = []
  const embeddedResults = []
  let topContext
  for (const index of linesWithEmbed) {
    const result = lineCache[index + 1]
    const line = lines[index]
    if (result.embeddedLanguage) {
      const { embeddedLanguage, embeddedLanguageEnd, embeddedLanguageStart } = result
      const embeddedTokenizer = Tokenizer.getTokenizer(embeddedLanguage)
      if (embeddedLanguageStart !== line.length && embeddedTokenizer && embeddedTokenizer !== TokenizePlainText) {
        const isFull = embeddedLanguageStart === 0 && embeddedLanguageEnd === line.length
        const partialLine = line.slice(embeddedLanguageStart, embeddedLanguageEnd)
        const embedResult = SafeTokenizeLine.safeTokenizeLine(
          langageId,
          embeddedTokenizer.tokenizeLine,
          partialLine,
          topContext || GetInitialLineState.getInitialLineState(embeddedTokenizer.initialLineState),
          embeddedTokenizer.hasArrayReturn,
        )
        topContext = embedResult
        result.embeddedResultIndex = embeddedResults.length
        embeddedResults.push({
          isFull,
          result: embedResult,
          TokenMap: embeddedTokenizer.TokenMap,
        })
      } else if (line.length === 0) {
        const embedResult = {
          tokens: [],
        }
        result.embeddedResultIndex = embeddedResults.length
        embeddedResults.push({
          isFull: true,
          result: embedResult,
          TokenMap: [],
        })
      } else {
        tokenizersToLoad.push(embeddedLanguage)
        embeddedResults.push({
          isFull: false,
          result: {},
          TokenMap: [],
        })
        topContext = undefined
      }
    } else {
      topContext = undefined
    }
  }
  return {
    embeddedResults,
    tokenizersToLoad,
  }
}

const getTokenizeEndIndex = (invalidStartIndex: any, endLineIndex: any, tokenizeStartIndex: any) => {
  return invalidStartIndex < endLineIndex ? endLineIndex : tokenizeStartIndex
}

// TODO only send changed lines to renderer process instead of all lines in viewport
export const getTokensViewport = (editor: any, startLineIndex: any, endLineIndex: any) => {
  const { invalidStartIndex, languageId, lineCache, lines, tokenizerId } = editor
  const tokenizer = TokenizerMap.get(tokenizerId)
  const { hasArrayReturn, initialLineState, tokenizeLine } = tokenizer
  const tokenizeStartIndex = invalidStartIndex
  const tokenizeEndIndex = getTokenizeEndIndex(invalidStartIndex, endLineIndex, tokenizeStartIndex)
  const tokenizersToLoad: any[] = []
  const embeddedResults: any[] = []
  const linesWithEmbed = []
  for (let i = tokenizeStartIndex; i < tokenizeEndIndex; i++) {
    const lineState = i === 0 ? GetInitialLineState.getInitialLineState(initialLineState) : lineCache[i]
    const line = lines[i]
    const result = SafeTokenizeLine.safeTokenizeLine(languageId, tokenizeLine, line, lineState, hasArrayReturn)
    // TODO if lineCacheEnd matches the one before, skip tokenizing lines after
    lineCache[i + 1] = result
    if (result.embeddedLanguage) {
      result.embeddedResultIndex = linesWithEmbed.length
      linesWithEmbed.push(i)
    }
  }
  const visibleLines = lineCache.slice(startLineIndex + 1, endLineIndex + 1)
  if (linesWithEmbed.length > 0) {
    const { embeddedResults, tokenizersToLoad } = getTokensViewportEmbedded(languageId, lines, lineCache, linesWithEmbed)
    // TODO support lineCache with embedded content
    editor.invalidStartIndex = 0
    return {
      embeddedResults,
      tokenizersToLoad,
      tokens: visibleLines,
    }
  }
  editor.invalidStartIndex = Math.max(invalidStartIndex, tokenizeEndIndex)
  return {
    embeddedResults,
    tokenizersToLoad,
    tokens: visibleLines,
  }
}
