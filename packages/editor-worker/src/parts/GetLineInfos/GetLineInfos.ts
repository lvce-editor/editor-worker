import * as GetInitialLineState from '../GetInitialLineState/GetInitialLineState.ts'
import * as GetLineInfo from '../GetLineInfo/GetLineInfo.ts'
import * as SafeTokenizeLine from '../SafeTokenizeLine/SafeTokenizeLine.ts'

export const getLineInfos = (lines: readonly string[], tokenizer: any, languageId: string) => {
  const lineInfos: Array<readonly string[]> = []
  const { hasArrayReturn, initialLineState, tokenizeLine, TokenMap } = tokenizer
  let currentLineState = GetInitialLineState.getInitialLineState(initialLineState)
  for (const line of lines) {
    const result = SafeTokenizeLine.safeTokenizeLine(languageId, tokenizeLine, line, currentLineState, hasArrayReturn)
    const { tokens } = result
    const lineInfo = GetLineInfo.getLineInfo(line, tokens, TokenMap)
    lineInfos.push(lineInfo)
    currentLineState = result
  }
  console.log({ lineInfos })
  return lineInfos
}
