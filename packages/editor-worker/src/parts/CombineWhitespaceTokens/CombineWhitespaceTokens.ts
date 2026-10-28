const canCombine = (text: string, className: string, previousClass: string | undefined): boolean => {
  return Boolean(previousClass && /^[ \t]+$/.test(text) && !className.includes(' ', 6) && !previousClass.includes(' ', 6))
}

export const combineWhitespaceTokens = (tokens: readonly string[]): readonly string[] => {
  let needsCombining = false
  for (let i = 2; i < tokens.length; i += 2) {
    if (canCombine(tokens[i], tokens[i + 1], tokens[i - 1])) {
      needsCombining = true
      break
    }
  }
  if (!needsCombining) {
    return tokens
  }
  const combined: string[] = []
  for (let i = 0; i < tokens.length; i += 2) {
    const tokenText = tokens[i]
    const tokenClass = tokens[i + 1]
    const previousClass = combined.at(-1)
    // Decorations add a class after the syntax class; preserve their exact ranges.
    if (canCombine(tokenText, tokenClass, previousClass)) {
      combined[combined.length - 2] += tokenText
    } else {
      combined.push(tokenText, tokens[i + 1])
    }
  }
  return combined
}
