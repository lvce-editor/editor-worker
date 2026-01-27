/**
 * Gets all regex matches for a given text and regex pattern
 * @param text The text to match against
 * @param regex The regex pattern to use (should have global flag)
 * @returns Array of regex matches
 */
export const getRegexMatches = (text: string, regex: RegExp): RegExpMatchArray[] => {
  return [...text.matchAll(regex)]
}
