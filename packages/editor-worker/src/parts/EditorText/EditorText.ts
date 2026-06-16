import * as GetDecorationClassName from '../GetDecorationClassName/GetDecorationClassName.ts'
import * as GetTokensViewport2 from '../GetTokensViewport2/GetTokensViewport2.ts'
import * as LoadTokenizers from '../LoadTokenizers/LoadTokenizers.ts'
import * as NormalizeText from '../NormalizeText/NormalizeText.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenMaps from '../TokenMaps/TokenMaps.ts'

const getStartDefaults = (tokens: any, minOffset: any) => {
  let start = 0
  let end = 0
  let startIndex = 0
  const tokensLength = tokens.length
  for (let i = 0; i < tokensLength; i += 2) {
    const tokenLength = tokens[i + 1]
    end += tokenLength
    start = end
    if (start >= minOffset) {
      start -= tokenLength
      end -= tokenLength
      startIndex = i
      break
    }
  }
  return {
    end,
    start,
    startIndex,
  }
}

const getOffsets = (deltaX: any, width: any, averageCharWidth: any) => {
  if (deltaX === 0) {
    return {
      maxOffset: Math.ceil(width / averageCharWidth),
      minOffset: 0,
    }
  }
  const minOffset = Math.ceil(deltaX / averageCharWidth)
  const maxOffset = minOffset + Math.ceil(width / averageCharWidth)
  return {
    maxOffset,
    minOffset,
  }
}

const getDifference = (start: number, averageCharWidth: number, deltaX: number) => {
  const beforeWidth = start * averageCharWidth
  return beforeWidth - deltaX
}

const getDecorationMap = (decorations: any, lineOffset: number, lineLength: number) => {
  const decorationMap = new Map<number, { end: number; className: string }>()
  for (let j = 0; j < decorations.length; j += 4) {
    const decorationOffset = decorations[j]
    const decorationLength = decorations[j + 1]
    const decorationType = decorations[j + 2]
    const relativeStart = decorationOffset - lineOffset
    const relativeEnd = relativeStart + decorationLength
    if (relativeStart < lineLength && relativeEnd > 0) {
      const decorationClassName = GetDecorationClassName.getDecorationClassName(decorationType)
      if (decorationClassName) {
        decorationMap.set(Math.max(0, relativeStart), {
          className: decorationClassName,
          end: Math.min(lineLength, relativeEnd),
        })
      }
    }
  }
  return decorationMap
}

const appendTokenInfo = (
  lineInfo: any[],
  text: string,
  tokens: readonly number[],
  tokenMap: any,
  decorationMap: Map<number, { end: number; className: string }>,
  normalize: boolean,
  tabSize: number,
  baseOffset: number,
  minOffset: number,
  maxOffset: number,
  rangeStart = 0,
  rangeEnd = text.length,
) => {
  const localMinOffset = Math.max(rangeStart, minOffset - baseOffset)
  const localMaxOffset = Math.min(rangeEnd, maxOffset - baseOffset)
  if (localMinOffset >= localMaxOffset || tokens.length === 0) {
    return -1
  }
  const { start: localStart, startIndex } = getStartDefaults(tokens, localMinOffset)
  const tokensLength = tokens.length
  let start = localStart
  let firstRenderedStart = -1
  for (let i = startIndex; i < tokensLength; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    const tokenEnd = start + tokenLength
    const effectiveStart = Math.max(start, rangeStart, localMinOffset)
    const effectiveEnd = Math.min(tokenEnd, rangeEnd, localMaxOffset)
    if (effectiveStart < effectiveEnd) {
      if (firstRenderedStart === -1) {
        firstRenderedStart = baseOffset + effectiveStart
      }
      const absoluteStart = baseOffset + effectiveStart
      const absoluteEnd = baseOffset + effectiveEnd
      let hasOverlap = false
      for (const [decorationStart, { end: decorationEnd }] of decorationMap) {
        if (decorationStart < absoluteEnd && decorationEnd > absoluteStart) {
          hasOverlap = true
          break
        }
      }
      if (hasOverlap) {
        let currentPos = absoluteStart
        while (currentPos < absoluteEnd) {
          let activeDecoration: { end: number; className: string } | null = null
          for (const [decorationStart, decoration] of decorationMap) {
            if (decorationStart <= currentPos && decoration.end > currentPos) {
              activeDecoration = decoration
              break
            }
          }
          if (activeDecoration) {
            const partEnd = Math.min(absoluteEnd, activeDecoration.end)
            const partText = text.slice(currentPos - baseOffset, partEnd - baseOffset)
            const baseTokenClass = tokenMap[tokenType] || 'Unknown'
            lineInfo.push(NormalizeText.normalizeText(partText, normalize, tabSize), `Token ${baseTokenClass} ${activeDecoration.className}`)
            currentPos = partEnd
          } else {
            let nextDecorationStart = absoluteEnd
            for (const [decorationStart] of decorationMap) {
              if (decorationStart > currentPos && decorationStart < absoluteEnd) {
                nextDecorationStart = Math.min(nextDecorationStart, decorationStart)
              }
            }
            const partEnd = nextDecorationStart
            const partText = text.slice(currentPos - baseOffset, partEnd - baseOffset)
            lineInfo.push(NormalizeText.normalizeText(partText, normalize, tabSize), `Token ${tokenMap[tokenType] || 'Unknown'}`)
            currentPos = partEnd
          }
        }
      } else {
        const tokenText = text.slice(effectiveStart, effectiveEnd)
        lineInfo.push(NormalizeText.normalizeText(tokenText, normalize, tabSize), `Token ${tokenMap[tokenType] || 'Unknown'}`)
      }
    }
    start = tokenEnd
    if (start >= localMaxOffset) {
      break
    }
  }
  return firstRenderedStart
}

const getLineInfoDefault = (
  line: string,
  tokenResults: any,
  decorations: any,
  tokenMap: any,
  lineOffset: number,
  normalize: boolean,
  tabSize: number,
  minOffset: number,
  maxOffset: number,
  averageCharWidth: number,
  deltaX: number,
) => {
  const lineInfo = []
  const decorationMap = getDecorationMap(decorations, lineOffset, line.length)
  const firstRenderedStart = appendTokenInfo(lineInfo, line, tokenResults.tokens, tokenMap, decorationMap, normalize, tabSize, 0, minOffset, maxOffset)
  return {
    difference: getDifference(firstRenderedStart === -1 ? minOffset : firstRenderedStart, averageCharWidth, deltaX),
    lineInfo,
  }
}

const getLineInfoEmbedded = (
  line: string,
  tokenResults: any,
  embeddedResults: any,
  decorations: any,
  tokenMap: any,
  lineOffset: number,
  normalize: boolean,
  tabSize: number,
  minOffset: number,
  maxOffset: number,
  averageCharWidth: number,
  deltaX: number,
) => {
  const embeddedResult = embeddedResults[tokenResults.embeddedResultIndex]
  if (!embeddedResult?.result?.tokens) {
    return undefined
  }
  const embeddedLanguageStart = tokenResults.embeddedLanguageStart || 0
  const embeddedLanguageEnd = tokenResults.embeddedLanguageEnd || 0
  if (embeddedLanguageEnd <= embeddedLanguageStart) {
    return undefined
  }
  const lineInfo = []
  const decorationMap = getDecorationMap(decorations, lineOffset, line.length)
  let firstRenderedStart = -1
  if (embeddedLanguageStart > 0) {
    firstRenderedStart = appendTokenInfo(
      lineInfo,
      line,
      tokenResults.tokens,
      tokenMap,
      decorationMap,
      normalize,
      tabSize,
      0,
      minOffset,
      maxOffset,
      0,
      embeddedLanguageStart,
    )
  }
  const embeddedText = line.slice(embeddedLanguageStart, embeddedLanguageEnd)
  const embeddedStart = appendTokenInfo(
    lineInfo,
    embeddedText,
    embeddedResult.result.tokens,
    embeddedResult.TokenMap,
    decorationMap,
    normalize,
    tabSize,
    embeddedLanguageStart,
    minOffset,
    maxOffset,
  )
  if (firstRenderedStart === -1) {
    firstRenderedStart = embeddedStart
  }
  if (embeddedLanguageEnd < line.length) {
    const suffixStart = appendTokenInfo(
      lineInfo,
      line,
      tokenResults.tokens,
      tokenMap,
      decorationMap,
      normalize,
      tabSize,
      0,
      minOffset,
      maxOffset,
      embeddedLanguageEnd,
      line.length,
    )
    if (firstRenderedStart === -1) {
      firstRenderedStart = suffixStart
    }
  }
  return {
    difference: getDifference(firstRenderedStart === -1 ? minOffset : firstRenderedStart, averageCharWidth, deltaX),
    lineInfo,
  }
}

const getLineInfo = (
  line: string,
  tokenResults: any,
  embeddedResults: any,
  decorations: any,
  tokenMap: any,
  lineOffset: number,
  normalize: boolean,
  tabSize: number,
  width: number,
  deltaX: number,
  averageCharWidth: number,
) => {
  const { maxOffset, minOffset } = getOffsets(deltaX, width, averageCharWidth)
  if (embeddedResults.length > 0 && tokenResults.embeddedResultIndex !== undefined) {
    const embeddedLineInfo = getLineInfoEmbedded(
      line,
      tokenResults,
      embeddedResults,
      decorations,
      tokenMap,
      lineOffset,
      normalize,
      tabSize,
      minOffset,
      maxOffset,
      averageCharWidth,
      deltaX,
    )
    if (embeddedLineInfo) {
      return embeddedLineInfo
    }
  }
  return getLineInfoDefault(line, tokenResults, decorations, tokenMap, lineOffset, normalize, tabSize, minOffset, maxOffset, averageCharWidth, deltaX)
}

const getHtmlEmbeddedTokenizers = (lines: readonly string[]) => {
  const tokenizers = []
  let needsCss = false
  let needsJavaScript = false
  for (const line of lines) {
    if (!needsCss && line.includes('<style')) {
      needsCss = true
    }
    if (!needsJavaScript && line.includes('<script')) {
      needsJavaScript = true
    }
    if (needsCss && needsJavaScript) {
      break
    }
  }
  if (needsCss) {
    tokenizers.push('css')
  }
  if (needsJavaScript) {
    tokenizers.push('javascript')
  }
  return tokenizers
}

const getLineInfosViewport = (
  editor: any,
  tokens: any,
  embeddedResults: any,
  minLineY: number,
  maxLineY: number,
  minLineOffset: number,
  width: number,
  deltaX: number,
  averageCharWidth: number,
) => {
  const result = []
  const differences = []
  const { decorations, languageId, lines } = editor
  const tokenMap = TokenMaps.get(languageId)
  let offset = minLineOffset
  const tabSize = 2
  for (let i = minLineY; i < maxLineY; i++) {
    const line = lines[i]
    const normalize = NormalizeText.shouldNormalizeText(line)
    const lineDecorations: number[] = []
    for (let j = 0; j < decorations.length; j += 4) {
      const decorationOffset = decorations[j]
      const decorationLength = decorations[j + 1]
      const decorationType = decorations[j + 2]
      const decorationModifiers = decorations[j + 3]
      if (decorationOffset >= offset && decorationOffset < offset + line.length) {
        lineDecorations.push(decorationOffset, decorationLength, decorationType, decorationModifiers)
      }
    }
    const { difference, lineInfo } = getLineInfo(
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
    )
    result.push(lineInfo)
    differences.push(difference)
    offset += line.length + 1
  }
  return {
    differences,
    result,
  }
}

export const getVisible = async (editor: any, syncIncremental: boolean) => {
  const { charWidth, deltaX, lines, minLineY, numberOfVisibleLines, width } = editor
  const maxLineY = Math.min(minLineY + numberOfVisibleLines, lines.length)
  if (editor.languageId === 'html') {
    const htmlEmbeddedTokenizers = getHtmlEmbeddedTokenizers(lines)
    if (htmlEmbeddedTokenizers.length > 0) {
      await LoadTokenizers.loadTokenizers(editor, htmlEmbeddedTokenizers)
    }
  }
  let { embeddedResults, tokenizersToLoad, tokens } = await GetTokensViewport2.getTokensViewport2(editor, minLineY, maxLineY, syncIncremental)
  if (tokenizersToLoad.length > 0) {
    await LoadTokenizers.loadTokenizers(editor, tokenizersToLoad)
    GetTokensViewport2.resetSentLines(editor.id)
    const updated = await GetTokensViewport2.getTokensViewport2(editor, minLineY, maxLineY, syncIncremental)
    embeddedResults = updated.embeddedResults
    tokens = updated.tokens
  }
  const minLineOffset = await TextDocument.offsetAtSync(editor, minLineY, 0)
  const { differences, result } = getLineInfosViewport(
    editor,
    tokens,
    embeddedResults,
    minLineY,
    maxLineY,
    minLineOffset,
    width,
    deltaX,
    charWidth,
  )
  return {
    differences,
    textInfos: result,
  }
}
