import * as GetDecorationClassName from '../GetDecorationClassName/GetDecorationClassName.ts'
import * as GetTokensViewport2 from '../GetTokensViewport2/GetTokensViewport2.ts'
import * as LoadTokenizers from '../LoadTokenizers/LoadTokenizers.ts'
import * as NormalizeText from '../NormalizeText/NormalizeText.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as TokenMaps from '../TokenMaps/TokenMaps.ts'

// const getTokens = (editor) => {
//   const tokens = []
//   const lines = editor.lines
//   let lineState = editor.tokenizer.initialLineState
//   // TODO lineCache should probably only store endOfLineState
//   // because storing tokens could maybe result in high
//   // memory usage (e.g. 10000 lines * 10 tokens per line = 100 000 objects stored)
//   // on the other hand, scrolling should be really fast, and needlessly
//   // recomputing tokens would be a waste of cpu time and cause lots of garbage collection
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
//     // can be changed (e.g. vscode has piece tree, codemirror has something like chunked arrays / string[][])
//     const line = lines[i]
//     lineState = safeTokenizeLine(tokenizeLine, line, lineState)
//     const newTokens = lineState.tokens
//     lineCache[i] = lineState
//     tokens.push(newTokens)
//   }
//   return tokens
// }

// TODO vscode has an interesting approach for tokenizing:
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
  const decorationMap = new Map<number, { end: number; className: string }>()
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
  let { end, start, startIndex } = getStartDefaults(embeddedTokens, minOffset)
  const difference = getDifference(start, averageCharWidth, deltaX)

  for (let i = startIndex; i < tokensLength; i += 2) {
    const tokenType = embeddedTokens[i]
    const tokenLength = embeddedTokens[i + 1]
    const tokenEnd = start + tokenLength

    // Check if any decorations overlap with this token
    let hasOverlap = false
    for (const [decorationStart, { end: decorationEnd }] of decorationMap) {
      if (decorationStart < tokenEnd && decorationEnd > start) {
        hasOverlap = true
        break
      }
    }

    if (hasOverlap) {
      // Token has decoration overlap - split into parts
      let currentPos = start

      while (currentPos < tokenEnd) {
        // Find if current position is inside a decoration
        let activeDecoration: { end: number; className: string } | null = null

        for (const [decorationStart, decoration] of decorationMap) {
          if (decorationStart <= currentPos && decoration.end > currentPos) {
            activeDecoration = decoration
            break
          }
        }

        if (activeDecoration) {
          // Render decorated part
          const partEnd = Math.min(tokenEnd, activeDecoration.end)
          const text = line.slice(currentPos, partEnd)
          const baseTokenClass = embeddedTokenMap[tokenType] || 'Unknown'
          const className = `Token ${baseTokenClass} ${activeDecoration.className}`
          const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
          lineInfo.push(normalizedText, className)
          currentPos = partEnd
        } else {
          // Find next decoration start or token end
          let nextDecorationStart = tokenEnd
          for (const [decorationStart] of decorationMap) {
            if (decorationStart > currentPos && decorationStart < tokenEnd) {
              nextDecorationStart = Math.min(nextDecorationStart, decorationStart)
            }
          }

          // Render non-decorated part
          const partEnd = nextDecorationStart
          const text = line.slice(currentPos, partEnd)
          const className = `Token ${embeddedTokenMap[tokenType] || 'Unknown'}`
          const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
          lineInfo.push(normalizedText, className)
          currentPos = partEnd
        }
      }
    } else {
      // No decoration overlap - render token normally
      const text = line.slice(start, tokenEnd)
      const className = `Token ${embeddedTokenMap[tokenType] || 'Unknown'}`
      const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
      lineInfo.push(normalizedText, className)
    }

    start = tokenEnd
    end = tokenEnd
    if (end >= maxOffset) {
      break
    }
  }

  return {
    difference,
    lineInfo,
  }
}

const getOffsets = (deltaX: any, width: any, averageCharWidth: any) => {
  // TODO accurately measure char widths using offscreen canvas
  // and use fast measurements for monospace ascii text
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

const getDifference = (start: any, averageCharWidth: any, deltaX: any) => {
  const beforeWidth = start * averageCharWidth
  const difference = beforeWidth - deltaX
  return difference
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
  const decorationMap = new Map<number, { end: number; className: string }>()
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
  let { end, start, startIndex } = getStartDefaults(tokens, minOffset)
  const difference = getDifference(start, averageCharWidth, deltaX)
  const tokensLength = tokens.length

  for (let i = startIndex; i < tokensLength; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    const tokenEnd = start + tokenLength

    // Check if any decorations overlap with this token
    let hasOverlap = false
    for (const [decorationStart, { end: decorationEnd }] of decorationMap) {
      if (decorationStart < tokenEnd && decorationEnd > start) {
        hasOverlap = true
        break
      }
    }

    if (hasOverlap) {
      // Token has decoration overlap - split into parts
      let currentPos = start

      while (currentPos < tokenEnd) {
        // Find if current position is inside a decoration
        let activeDecoration: { end: number; className: string } | null = null

        for (const [decorationStart, decoration] of decorationMap) {
          if (decorationStart <= currentPos && decoration.end > currentPos) {
            activeDecoration = decoration
            break
          }
        }

        if (activeDecoration) {
          // Render decorated part
          const partEnd = Math.min(tokenEnd, activeDecoration.end)
          const text = line.slice(currentPos, partEnd)
          const baseTokenClass = TokenMap[tokenType] || 'Unknown'
          const className = `Token ${baseTokenClass} ${activeDecoration.className}`
          const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
          lineInfo.push(normalizedText, className)
          currentPos = partEnd
        } else {
          // Find next decoration start or token end
          let nextDecorationStart = tokenEnd
          for (const [decorationStart] of decorationMap) {
            if (decorationStart > currentPos && decorationStart < tokenEnd) {
              nextDecorationStart = Math.min(nextDecorationStart, decorationStart)
            }
          }

          // Render non-decorated part
          const partEnd = nextDecorationStart
          const text = line.slice(currentPos, partEnd)
          const className = `Token ${TokenMap[tokenType] || 'Unknown'}`
          const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
          lineInfo.push(normalizedText, className)
          currentPos = partEnd
        }
      }
    } else {
      // No decoration overlap - render token normally
      const text = line.slice(start, tokenEnd)
      const className = `Token ${TokenMap[tokenType] || 'Unknown'}`
      const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
      lineInfo.push(normalizedText, className)
    }

    start = tokenEnd
    end = tokenEnd
    if (end >= maxOffset) {
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
) => {
  const { maxOffset, minOffset } = getOffsets(deltaX, width, averageCharWidth)
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
const getLineInfosViewport = (
  editor: any,
  tokens: any,
  embeddedResults: any,
  minLineY: any,
  maxLineY: any,
  minLineOffset: any,
  width: any,
  deltaX: any,
  averageCharWidth: any,
) => {
  const result = []
  const differences = []
  const { decorations, languageId, lines } = editor
  if (decorations && decorations.length > 0) {
    // eslint-disable-next-line no-console
    console.log('[DEBUG getLineInfosViewport]', { decorations, minLineY, maxLineY, minLineOffset })
  }
  const tokenMap = TokenMaps.get(languageId)
  let offset = minLineOffset
  const tabSize = 2
  for (let i = minLineY; i < maxLineY; i++) {
    const line = lines[i]
    const normalize = NormalizeText.shouldNormalizeText(line)

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
  // TODO should separate rendering from business logic somehow
  // currently hard to test because need to mock editor height, top, left,
  // invalidStartIndex, lineCache, etc. just for testing editorType
  // editor.invalidStartIndex = changes[0].start.rowIndex
  // @ts-ignore
  const { charWidth, deltaX, fontFamily, fontSize, fontWeight, letterSpacing, lines, minLineY, numberOfVisibleLines, width } = editor
  const maxLineY = Math.min(minLineY + numberOfVisibleLines, lines.length)
  // @ts-ignore
  const { embeddedResults, tokenizersToLoad, tokens } = await GetTokensViewport2.getTokensViewport2(editor, minLineY, maxLineY, syncIncremental)
  const minLineOffset = await TextDocument.offsetAtSync(editor, minLineY, 0)
  const averageCharWidth = charWidth
  const { differences, result } = getLineInfosViewport(
    editor,
    tokens,
    embeddedResults,
    minLineY,
    maxLineY,
    minLineOffset,
    width,
    deltaX,
    averageCharWidth,
  )
  if (tokenizersToLoad.length > 0) {
    LoadTokenizers.loadTokenizers(tokenizersToLoad)
  }
  return {
    differences,
    textInfos: result,
  }
}
