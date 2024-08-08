export const isMultiLineMatch = (lines: readonly string[], rowIndex: number, wordParts: any[]) => {
  let j = 0
  if (!lines[rowIndex + j].endsWith(wordParts[j])) {
    return false
  }
  while (++j < wordParts.length - 1) {
    if (lines[rowIndex + j] !== wordParts[j]) {
      return false
    }
  }
  if (!lines[rowIndex + j].startsWith(wordParts[j])) {
    return false
  }
  return true
}
