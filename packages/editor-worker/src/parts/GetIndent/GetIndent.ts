const RE_WHITESPACE = /^\s+/

// TODO this doesn't belong here
export const getIndent = (line: string) => {
  const whitespaceMatch = line.match(RE_WHITESPACE)
  if (!whitespaceMatch) {
    return ''
  }
  return whitespaceMatch[0]
}
