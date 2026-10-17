import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import * as GetDecorationClassName from '../GetDecorationClassName/GetDecorationClassName.ts'
import { getHorizontalScrollDimensions } from '../GetHorizontalScrollDimensions/GetHorizontalScrollDimensions.ts'
import * as GetHorizontalVisibleRange from '../GetHorizontalVisibleRange/GetHorizontalVisibleRange.ts'
import { getLargeFileVisible } from '../GetLargeFileVisible/GetLargeFileVisible.ts'
import * as GetTokensViewport2 from '../GetTokensViewport2/GetTokensViewport2.ts'
import * as LoadTokenizers from '../LoadTokenizers/LoadTokenizers.ts'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'
import * as NormalizeText from '../NormalizeText/NormalizeText.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenMaps from '../TokenMaps/TokenMaps.ts'

const maxTokenizerLoadPasses = 10

const getGraphemeSegments = async (lines: readonly string[]) => {
  try {
    return await TextMeasurementWorker.invoke('TextMeasurement.getGraphemeSegments', lines)
  } catch {
    return undefined
  }
}

// const getTokens = (editor) => {
//   const tokens = []
//   const lines = editor.lines
//   let lineState = editor.tokenizer.initialLineState
//   // TODO lineCache should probably only store endOfLineState
//   // because storing tokens could maybe result in high
//   // memory usage (e.g. 10000 lines * 10 tokens per line = 100 000 objects stored)
//   // on the other hand, scrolling should be really fast, and needlessly
//   // recomputing tokens would be a waste of CPU time and cause lots of garbage collection
//   const lineCache = editor.lineCache
//   // TODO only compute tokens in viewport
//   // const cachedLineStates = Object.create(null)
//   // if(cachedLineStates[i])
//   const tokenizeLine = editor.tokenizer.tokenizeLine
//   for (let i = 0; i < lines.length; i++) {
//     if (lineCache[i]) {
//       tokens.push(lineCache[i].tokens)
//       continue
//     }
//     // TODO use TextDocument.getLine so that text document buffer implementation
//     // can be changed (e.g. VS Code has piece tree, codemirror has something like chunked arrays / string[][])
//     const line = lines[i]
//     lineState = safeTokenizeLine(tokenizeLine, line, lineState)
//     const newTokens = lineState.tokens
//     lineCache[i] = lineState
//     tokens.push(newTokens)
//   }
//   return tokens
// }

// TODO VS Code has an interesting approach for tokenizing:
// first, the viewport is tokenized from startLine to endLine
// the first iteration might not be accurate because for example
// there can be a open multiline comment at the start of the file
// which is not taken into account for this first tokenization
// but after some time (onIdle), the background tokenizer is invoked
// that gives accurate results (but can take much longer since it
// might need to parse from the start of the file)
//
// another approach would be to show plain text (non-highlighted)
// when scrolling fast and the tokenizer is too slow to parse from
// the start of the file
//
// the approach implemented below for tokenizing the viewport
// is just to parse from the start of the file if necessary
// that doesn't scale well for large files but it is simpler
// to implement for now

// TODO only send changed lines to renderer process instead of all lines in viewport

// @ts-ignore
const invalidateLine = (editor, index) => {
  editor.validLines[index] = false
  if (index < editor.invalidStartIndex) {
    editor.invalidStartIndex = index
  }
}

// @ts-ignore
const applyChangesToSyntaxHighlighting = (editor, changes) => {
  // TODO invalidate lines that are affected
}

// const getTokensIncremental = (editor, min, max) => {
//   const currentLength = editor.lineStateCache.length
//   const tokens = []
//   const lines = editor.lines
//   let lineState = editor.tokenizer.initialLineState
//   for (let i = currentLength; i < max; i++) {
//     const line = lines[i]
//     try {
//       lineState = editor.tokenizer.tokenizeLine(line, lineState)
//       if (!lineState || !lineState.tokens || !lineState.state) {
//         throw new Error('invalid tokenization result')
//       }
//     } catch (error) {
//       tokens.push([{ length: line.length, type: 0 }])
//       console.error(error)
//       // renderWithoutSyntaxHighlighting(state, firstRow, lastRow)
//       continue
//     }
//     const newTokens = lineState.tokens
//     tokens.push(newTokens)
//   }
//   return tokens
// }

// const getLineInfosIncremental = (editor, tokens, minLineY, maxLineY) => {
//   const result = []
//   const lines = editor.lines
//   const TokenMap = editor.tokenizer.TokenMap
//   for (let i = minLineY; i < maxLineY; i++) {
//     result.push(getLineInfo(lines[i], tokens[i], TokenMap))
//   }
//   return result
// }

const getStartDefaults = (tokens: any, minOffset: any) => {
  let start = 0
  let end = 0
  let startIndex = 0
  let found = false
  const tokensLength = tokens.length
  for (let i = 0; i < tokensLength; i += 2) {
    const tokenLength = tokens[i + 1]
    end += tokenLength
    start = end
    if (start > minOffset) {
      start -= tokenLength
      end -= tokenLength
      startIndex = i
      found = true
      break
    }
  }
  if (!found) {
    return { start: end, startIndex: tokensLength }
  }
  return {
    start,
    startIndex,
  }
}

interface DecorationInfo {
  className: string
  end: number
}

const hasDecorationOverlap = (decorationMap: Map<number, DecorationInfo>, tokenStart: number, tokenEnd: number): boolean => {
  for (const [decorationStart, { end: decorationEnd }] of decorationMap) {
    if (decorationStart < tokenEnd && decorationEnd > tokenStart) {
      return true
    }
  }
  return false
}

const getActiveDecoration = (decorationMap: Map<number, DecorationInfo>, currentPos: number): DecorationInfo | undefined => {
  for (const [decorationStart, decoration] of decorationMap) {
    if (decorationStart <= currentPos && decoration.end > currentPos) {
      return decoration
    }
  }
  return undefined
}

const getLineInfoEmbeddedFull = (
  embeddedResults: any,
  tokenResults: any,
  line: any,
  decorations: any,
  lineOffset: any,
  normalize: any,
  tabSize: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
  minOffset: any,
  maxOffset: any,
) => {
  const lineInfo = []

  // Build decoration map for this line (position -> decoration class)
  const decorationMap = new Map<number, DecorationInfo>()
  for (let j = 0; j < decorations.length; j += 4) {
    const decorationOffset = decorations[j]
    const decorationLength = decorations[j + 1]
    const decorationType = decorations[j + 2]

    const relativeStart = decorationOffset - lineOffset
    const relativeEnd = relativeStart + decorationLength

    // Only include decorations that overlap with this line
    if (relativeStart < line.length && relativeEnd > 0) {
      const decorationClassName = GetDecorationClassName.getDecorationClassName(decorationType)
      if (decorationClassName) {
        decorationMap.set(Math.max(0, relativeStart), {
          className: decorationClassName,
          end: Math.min(line.length, relativeEnd),
        })
      }
    }
  }

  const embeddedResult = embeddedResults[tokenResults.embeddedResultIndex]
  const embeddedTokens = embeddedResult.result.tokens
  const embeddedTokenMap = embeddedResult.TokenMap
  const tokensLength = embeddedTokens.length
  let { start, startIndex } = getStartDefaults(embeddedTokens, minOffset)
  const difference = GetHorizontalVisibleRange.getHorizontalVisibleDifference(line, Math.max(start, minOffset), deltaX, averageCharWidth, tabSize)

  for (let i = startIndex; i < tokensLength; i += 2) {
    const tokenType = embeddedTokens[i]
    const tokenLength = embeddedTokens[i + 1]
    const tokenEnd = start + tokenLength

    const tokenStart = Math.max(start, minOffset)
    const visibleTokenEnd = Math.min(tokenEnd, maxOffset)
    if (tokenStart >= visibleTokenEnd) {
      break
    }
    const hasOverlap = hasDecorationOverlap(decorationMap, tokenStart, visibleTokenEnd)

    if (hasOverlap) {
      // Token has decoration overlap - split into parts
      let currentPos = tokenStart

      while (currentPos < visibleTokenEnd) {
        // Find if current position is inside a decoration
        const activeDecoration = getActiveDecoration(decorationMap, currentPos)

        let partEnd
        let text
        let className

        if (activeDecoration) {
          // Render decorated part
          partEnd = Math.min(visibleTokenEnd, activeDecoration.end)
          text = line.slice(currentPos, partEnd)
          const baseTokenClass = embeddedTokenMap[tokenType] || 'Unknown'
          className = `Token ${baseTokenClass} ${activeDecoration.className}`
        } else {
          // Find next decoration start or token end
          let nextDecorationStart = visibleTokenEnd
          for (const [decorationStart] of decorationMap) {
            if (decorationStart > currentPos && decorationStart < visibleTokenEnd) {
              nextDecorationStart = Math.min(nextDecorationStart, decorationStart)
            }
          }

          // Render non-decorated part
          partEnd = nextDecorationStart
          text = line.slice(currentPos, partEnd)
          className = `Token ${embeddedTokenMap[tokenType] || 'Unknown'}`
        }
        const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
        lineInfo.push(normalizedText, className)
        currentPos = partEnd
      }
    } else {
      // No decoration overlap - render token normally
      const text = line.slice(tokenStart, visibleTokenEnd)
      const className = `Token ${embeddedTokenMap[tokenType] || 'Unknown'}`
      const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
      lineInfo.push(normalizedText, className)
    }

    start = tokenEnd
    if (start >= maxOffset) {
      break
    }
  }

  return {
    difference,
    lineInfo,
  }
}

const appendTokenRange = (
  resultTokens: number[],
  resultTokenMap: Record<number, string>,
  tokens: readonly number[],
  tokenMap: Record<number, string>,
  rangeStart: number,
  rangeEnd: number,
) => {
  let tokenStart = 0
  for (let i = 0; i < tokens.length; i += 2) {
    const tokenType = tokens[i]
    const tokenEnd = tokenStart + tokens[i + 1]
    const start = Math.max(tokenStart, rangeStart)
    const end = Math.min(tokenEnd, rangeEnd)
    if (start < end) {
      const resultTokenType = resultTokens.length / 2
      resultTokens.push(resultTokenType, end - start)
      resultTokenMap[resultTokenType] = tokenMap[tokenType] || 'Unknown'
    }
    tokenStart = tokenEnd
  }
}

const mergeEmbeddedTokens = (line: string, tokenResults: any, embeddedResult: any, tokenMap: Record<number, string>) => {
  const embeddedStart = Math.max(0, Math.min(line.length, tokenResults.embeddedLanguageStart))
  const embeddedEnd = Math.max(embeddedStart, Math.min(line.length, tokenResults.embeddedLanguageEnd))
  const tokens: number[] = []
  const mergedTokenMap: Record<number, string> = Object.create(null)
  appendTokenRange(tokens, mergedTokenMap, tokenResults.tokens, tokenMap, 0, embeddedStart)
  appendTokenRange(tokens, mergedTokenMap, embeddedResult.result.tokens, embeddedResult.TokenMap, 0, embeddedEnd - embeddedStart)
  appendTokenRange(tokens, mergedTokenMap, tokenResults.tokens, tokenMap, embeddedEnd, line.length)
  return {
    tokenMap: mergedTokenMap,
    tokens,
  }
}

const getLineInfoDefault = (
  line: any,
  tokenResults: any,
  embeddedResults: any,
  decorations: any,
  TokenMap: any,
  lineOffset: any,
  normalize: any,
  tabSize: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
  minOffset: any,
  maxOffset: any,
) => {
  const lineInfo = []

  // Build decoration map for this line (position -> decoration class)
  const decorationMap = new Map<number, DecorationInfo>()
  for (let j = 0; j < decorations.length; j += 4) {
    const decorationOffset = decorations[j]
    const decorationLength = decorations[j + 1]
    const decorationType = decorations[j + 2]

    const relativeStart = decorationOffset - lineOffset
    const relativeEnd = relativeStart + decorationLength

    // Only include decorations that overlap with this line
    if (relativeStart < line.length && relativeEnd > 0) {
      const decorationClassName = GetDecorationClassName.getDecorationClassName(decorationType)
      if (decorationClassName) {
        decorationMap.set(Math.max(0, relativeStart), {
          className: decorationClassName,
          end: Math.min(line.length, relativeEnd),
        })
      }
    }
  }

  const { tokens } = tokenResults
  let { start, startIndex } = getStartDefaults(tokens, minOffset)
  const difference = GetHorizontalVisibleRange.getHorizontalVisibleDifference(line, Math.max(start, minOffset), deltaX, averageCharWidth, tabSize)
  const tokensLength = tokens.length

  for (let i = startIndex; i < tokensLength; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    const tokenEnd = start + tokenLength

    const tokenStart = Math.max(start, minOffset)
    const visibleTokenEnd = Math.min(tokenEnd, maxOffset)
    if (tokenStart >= visibleTokenEnd) {
      break
    }
    const hasOverlap = hasDecorationOverlap(decorationMap, tokenStart, visibleTokenEnd)

    if (hasOverlap) {
      // Token has decoration overlap - split into parts
      let currentPos = tokenStart

      while (currentPos < visibleTokenEnd) {
        // Find if current position is inside a decoration
        const activeDecoration = getActiveDecoration(decorationMap, currentPos)

        let partEnd
        let text
        let className

        if (activeDecoration) {
          // Render decorated part
          partEnd = Math.min(visibleTokenEnd, activeDecoration.end)
          text = line.slice(currentPos, partEnd)
          const baseTokenClass = TokenMap[tokenType] || 'Unknown'
          className = `Token ${baseTokenClass} ${activeDecoration.className}`
        } else {
          // Find next decoration start or token end
          let nextDecorationStart = visibleTokenEnd
          for (const [decorationStart] of decorationMap) {
            if (decorationStart > currentPos && decorationStart < visibleTokenEnd) {
              nextDecorationStart = Math.min(nextDecorationStart, decorationStart)
            }
          }

          // Render non-decorated part
          partEnd = nextDecorationStart
          text = line.slice(currentPos, partEnd)
          className = `Token ${TokenMap[tokenType] || 'Unknown'}`
        }
        const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
        lineInfo.push(normalizedText, className)
        currentPos = partEnd
      }
    } else {
      // No decoration overlap - render token normally
      const text = line.slice(tokenStart, visibleTokenEnd)
      const className = `Token ${TokenMap[tokenType] || 'Unknown'}`
      const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
      lineInfo.push(normalizedText, className)
    }

    start = tokenEnd
    if (start >= maxOffset) {
      break
    }
  }

  return {
    difference,
    lineInfo,
  }
}

const getLineInfo = (
  line: any,
  tokenResults: any,
  embeddedResults: any,
  decorations: any,
  TokenMap: any,
  lineOffset: any,
  normalize: any,
  tabSize: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
  measuredRange: { readonly difference: number; readonly end: number; readonly start: number },
) => {
  const { end: maxOffset, start: minOffset } = measuredRange
  if (embeddedResults.length > 0 && tokenResults.embeddedResultIndex !== undefined) {
    const embeddedResult = embeddedResults[tokenResults.embeddedResultIndex]
    if (embeddedResult?.isFull) {
      return getLineInfoEmbeddedFull(
        embeddedResults,
        tokenResults,
        line,
        decorations,
        lineOffset,
        normalize,
        tabSize,
        width,
        deltaX,
        averageCharWidth,
        minOffset,
        maxOffset,
      )
    }
    if (embeddedResult?.result?.tokens) {
      const merged = mergeEmbeddedTokens(line, tokenResults, embeddedResult, TokenMap)
      return getLineInfoDefault(
        line,
        merged,
        embeddedResults,
        decorations,
        merged.tokenMap,
        lineOffset,
        normalize,
        tabSize,
        width,
        deltaX,
        averageCharWidth,
        minOffset,
        maxOffset,
      )
    }
  }
  return getLineInfoDefault(
    line,
    tokenResults,
    embeddedResults,
    decorations,
    TokenMap,
    lineOffset,
    normalize,
    tabSize,
    width,
    deltaX,
    averageCharWidth,
    minOffset,
    maxOffset,
  )
}

// TODO need lots of tests for this
const getLineInfosViewport = async (
  editor: any,
  tokens: any,
  embeddedResults: any,
  minLineY: any,
  maxLineY: any,
  minLineOffset: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
  horizontalVirtualizationThreshold: number,
) => {
  const result = []
  const differences = []
  const horizontalVisibleRanges = []
  const { decorations, languageId, lines } = editor
  const tokenMap = TokenMaps.get(languageId)
  let offset = minLineOffset
  const tabSize = editor.tabSize ?? 2
  const visibleLines = lines.slice(minLineY, maxLineY)
  const graphemeSegments = await getGraphemeSegments(visibleLines)
  const measuredRanges = await GetHorizontalVisibleRange.getHorizontalVisibleRangesMeasured(
    visibleLines.map((line: string, index: number) => ({
      averageCharWidth,
      deltaX,
      line,
      segments: graphemeSegments?.[index],
      tabSize,
      threshold: horizontalVirtualizationThreshold,
      width,
    })),
    (texts) =>
      MeasureTextWidth.measureTextWidths(
        texts,
        editor.fontWeight,
        editor.fontSize,
        editor.fontFamily,
        editor.letterSpacing,
        editor.isMonospaceFont,
        editor.charWidth,
      ),
  )
  for (let i = minLineY; i < maxLineY; i++) {
    const line = lines[i]
    const normalize = NormalizeText.shouldNormalizeText(line)
    const measuredRange = measuredRanges[i - minLineY]

    // Use decorations that were pre-computed (includes links and diagnostics)
    // Filter decorations to only include those for this line
    const lineDecorations: number[] = []
    for (let j = 0; j < decorations.length; j += 4) {
      const decorationOffset = decorations[j]
      const decorationLength = decorations[j + 1]
      const decorationType = decorations[j + 2]
      const decorationModifiers = decorations[j + 3]

      // Include decoration if it starts within this line
      if (decorationOffset >= offset && decorationOffset < offset + line.length) {
        lineDecorations.push(decorationOffset, decorationLength, decorationType, decorationModifiers)
      }
    }

    const { lineInfo } = getLineInfo(
      line,
      tokens[i - minLineY],
      embeddedResults,
      lineDecorations,
      tokenMap,
      offset,
      normalize,
      tabSize,
      width,
      deltaX,
      averageCharWidth,
      measuredRange,
    )
    result.push(lineInfo)
    differences.push(measuredRange.difference)
    horizontalVisibleRanges.push({
      end: measuredRange.end,
      rowIndex: i,
      segments: graphemeSegments?.[i - minLineY],
      start: measuredRange.start,
    })
    offset += line.length + 1
  }
  return {
    differences,
    horizontalVisibleRanges,
    result,
  }
}

export const getVisible = async (
  editor: any,
  syncIncremental: boolean,
): Promise<{
  differences: number[]
  horizontalVisibleRanges: {
    end: number
    rowIndex: number
    segments?: readonly number[]
    start: number
  }[]
  textInfos: string[][]
}> => {
  if (editor.lifecycle?.disposed) {
    return { differences: [], horizontalVisibleRanges: [], textInfos: [] }
  }
  if (editor.largeFile) {
    return { ...(await getLargeFileVisible(editor)), horizontalVisibleRanges: [] }
  }
  // TODO should separate rendering from business logic somehow
  // currently hard to test because need to mock editor height, top, left,
  // invalidStartIndex, lineCache, etc. just for testing editorType
  // editor.invalidStartIndex = changes[0].start.rowIndex
  // @ts-ignore
  const { charWidth, deltaX, horizontalVirtualizationThreshold = 500, lines } = editor
  const { width } = getHorizontalScrollDimensions(editor)
  const visibleLineIndices = (
    editor.visibleLineIndices ??
    Array.from(
      {
        length: Math.max(0, Math.min(editor.maxLineY ?? editor.minLineY + editor.numberOfVisibleLines, lines.length) - editor.minLineY),
      },
      (_, index) => editor.minLineY + index,
    )
  ).filter((rowIndex: number) => rowIndex >= 0 && rowIndex < lines.length)
  if (visibleLineIndices.length === 0) {
    return {
      differences: [],
      horizontalVisibleRanges: [],
      textInfos: [],
    }
  }
  const minLineY = visibleLineIndices[0]
  const maxLineY = visibleLineIndices.at(-1) + 1
  // @ts-ignore
  let { embeddedResults, tokenizersToLoad, tokens } = await GetTokensViewport2.getTokensViewport2(editor, minLineY, maxLineY, syncIncremental)
  for (let i = 0; tokenizersToLoad.length > 0 && i < maxTokenizerLoadPasses; i++) {
    await LoadTokenizers.loadTokenizers(tokenizersToLoad)
    if (editor.lifecycle?.disposed) {
      return { differences: [], horizontalVisibleRanges: [], textInfos: [] }
    }
    // @ts-ignore
    const refreshed = await GetTokensViewport2.getTokensViewport2(editor, minLineY, maxLineY, syncIncremental)
    ;({ embeddedResults, tokenizersToLoad, tokens } = refreshed)
  }
  if (editor.lifecycle?.disposed) {
    return { differences: [], horizontalVisibleRanges: [], textInfos: [] }
  }
  const minLineOffset = await TextDocument.offsetAtSync(editor, minLineY, 0)
  const averageCharWidth = charWidth
  const {
    differences: allDifferences,
    horizontalVisibleRanges: allHorizontalVisibleRanges,
    result: allTextInfos,
  } = await getLineInfosViewport(
    editor,
    tokens,
    embeddedResults,
    minLineY,
    maxLineY,
    minLineOffset,
    width,
    deltaX,
    averageCharWidth,
    horizontalVirtualizationThreshold,
  )
  const relativeIndices = visibleLineIndices.map((rowIndex: number) => rowIndex - minLineY)
  return {
    differences: relativeIndices.map((index: number) => allDifferences[index]),
    horizontalVisibleRanges: allHorizontalVisibleRanges.filter(({ rowIndex }: { readonly rowIndex: number }) =>
      visibleLineIndices.includes(rowIndex),
    ),
    textInfos: relativeIndices.map((index: number) => allTextInfos[index]),
  }
}
