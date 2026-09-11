export const combineWhitespaceTokens = (tokens: readonly string[]): readonly string[] => {
  const combined: string[] = []
  for (let i = 0; i < tokens.length; i += 2) {
    const tokenText = tokens[i]
    if (combined.length > 0 && /^[ \t]+$/.test(tokenText)) {
      combined[combined.length - 2] += tokenText
    } else {
      combined.push(tokenText, tokens[i + 1])
    }
  }
  return combined
}
