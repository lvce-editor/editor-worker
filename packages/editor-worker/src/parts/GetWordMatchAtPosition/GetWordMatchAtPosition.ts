import * as IsAlphaNumeric from '../IsAlphaNumeric/IsAlphaNumeric.ts'

const getWordStartIndex = (line: string, index: number) => {
  for (let i = index - 1; i >= 0; i--) {
    if (!IsAlphaNumeric.isAlphaNumeric(line[i])) {
      return i + 1
    }
  }
  return 0
}

const getWordEndIndex = (line: string, index: number) => {
  for (let i = index; i < line.length; i++) {
    if (!IsAlphaNumeric.isAlphaNumeric(line[i])) {
      return i
    }
  }
  return line.length - 1
}

export const getWordMatchAtPosition = (lines: string[], rowIndex: number, columnIndex: number) => {
  const line = lines[rowIndex]
  const start = getWordStartIndex(line, columnIndex)
  const end = getWordEndIndex(line, columnIndex)
  const word = line.slice(start, end)
  return {
    start,
    end,
    word,
  }
}
