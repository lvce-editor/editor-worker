import * as GetTokensViewport2 from '../GetTokensViewport2/GetTokensViewport2.ts'
import * as LoadTokenizers from '../LoadTokenizers/LoadTokenizers.ts'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.ts'

const maxTokenizerLoadPasses = 10

const getLine = (lineState: any, embeddedResults: readonly any[], tokenMap: any, lineLength: number): readonly (number | string)[] => {
  const embeddedResult = embeddedResults[lineState?.embeddedResultIndex]
  const useEmbeddedResult = Boolean(embeddedResult?.isFull)
  const tokens = (useEmbeddedResult ? embeddedResult.result.tokens : lineState?.tokens) || [0, lineLength]
  const lineTokenMap = useEmbeddedResult ? embeddedResult.TokenMap : tokenMap
  const line: (number | string)[] = []
  for (let i = 0; i < tokens.length; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    line.push(tokenLength, `Token ${lineTokenMap[tokenType] || 'Unknown'}`)
  }
  return line
}

export const getMinimapLines = async (editor: any, syncIncremental: boolean): Promise<readonly (readonly (number | string)[])[]> => {
  const { lines } = editor
  if (lines.length === 0) {
    return []
  }
  let result = await GetTokensViewport2.getTokensViewport2(editor, 0, lines.length, syncIncremental)
  for (let i = 0; result.tokenizersToLoad.length > 0 && i < maxTokenizerLoadPasses; i++) {
    await LoadTokenizers.loadTokenizers(result.tokenizersToLoad)
    result = await GetTokensViewport2.getTokensViewport2(editor, 0, lines.length, syncIncremental)
  }
  const tokenizer = TokenizerMap.get(editor.tokenizerId)
  const tokenMap = tokenizer.TokenMap || {}
  return result.tokens.map((lineState: any, index: number) => getLine(lineState, result.embeddedResults, tokenMap, lines[index].length))
}
