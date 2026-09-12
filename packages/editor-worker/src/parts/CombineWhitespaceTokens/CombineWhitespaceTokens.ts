export const combineWhitespaceTokens = (tokens: readonly string[]): readonly string[] => {
  const combined: string[] = []
  for (let i = 0; i < tokens.length; i += 2) {
    const tokenText = tokens[i]
    const tokenClass = tokens[i + 1]
    const previousClass = combined[combined.length - 1]
    // Decorations add a class after the syntax class; preserve their exact ranges.
    if (combined.length > 0 && /^[ \t]+$/.test(tokenText) && !tokenClass.includes(' ', 6) && !previousClass.includes(' ', 6)) {
      combined[combined.length - 2] += tokenText
    } else {
      combined.push(tokenText, tokens[i + 1])
    }
  }
  return combined
}
