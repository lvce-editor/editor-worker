import * as FindStrings from '../FindStrings/FindStrings.ts'

export const getMatchCountText = (matchIndex: number, matchCount: number) => {
  if (matchCount === 0) {
    return FindStrings.noResults()
  }
  return FindStrings.matchOf(matchIndex + 1, matchCount)
}
