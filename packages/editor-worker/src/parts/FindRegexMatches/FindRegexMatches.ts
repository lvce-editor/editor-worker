export const findRegexMatches = (lines: readonly string[], regex: RegExp): Uint32Array => {
  if (!regex.global) {
    throw new Error('regex must be global')
  }
  const { length } = lines
  const matches = []
  for (let i = 0; i < length; i++) {
    const line = lines[i]
    let lastMatch
    do {
      lastMatch = regex.exec(line)
      if (!lastMatch) {
        break
      }
      matches.push(i, lastMatch.index)
    } while (true)
  }
  return new Uint32Array(matches)
}
