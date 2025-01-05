import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FindMatchesCaseInsensitive from '../FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.ts'
import * as GetMatchCount from '../GetMatchCount/GetMatchCount.ts'

export const refresh = (editor: any, state: FindWidgetState, value: string): FindWidgetState => {
  const { lines } = editor
  const matches = FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, value)
  const matchCount = GetMatchCount.getMatchCount(matches)
  return {
    ...state,
    matches,
    matchIndex: 0,
    matchCount,
    value,
  }
}
