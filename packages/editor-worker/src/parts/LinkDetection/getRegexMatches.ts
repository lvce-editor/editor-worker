/**
 * Gets all regex matches for a given text and regex pattern
 * @param text The text to match against
 * @param regex The regex pattern to use (should have global flag)
 * @returns Array of regex matches
 */
export const getRegexMatches = (text: string, regex: RegExp): readonly RegExpMatchArray[] => {
  const localRegex = new RegExp(regex.source, regex.flags)
  localRegex.lastIndex = 0
  const matches: RegExpMatchArray[] = []
  for (const match of text.matchAll(localRegex)) {
    matches.push(match)
  }
  localRegex.lastIndex = 0
  return matches
}
