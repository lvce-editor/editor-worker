const RE_WORD = /[\w\-]+$/

export const getWordAtOffset = (editor: any): string => {
  const { lines, selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const line = lines[rowIndex]
  const part = line.slice(0, columnIndex)
  const wordMatch = part.match(RE_WORD)
  if (wordMatch) {
    return wordMatch[0]
  }
  return ''
}
