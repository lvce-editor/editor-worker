export interface BracketPosition {
  readonly columnIndex: number
  readonly rowIndex: number
}

export interface BracketPair {
  readonly match: BracketPosition
  readonly source: BracketPosition
  readonly sourceIsBeforeCursor: boolean
}

const closingBrackets: Readonly<Record<string, string>> = {
  '(': ')',
  '[': ']',
  '{': '}',
}

const openingBrackets: Readonly<Record<string, string>> = {
  ')': '(',
  ']': '[',
  '}': '{',
}

const isOpeningBracket = (character: string): boolean => character in closingBrackets

const isClosingBracket = (character: string): boolean => character in openingBrackets

const isBefore = (left: BracketPosition, right: BracketPosition): boolean =>
  left.rowIndex < right.rowIndex || (left.rowIndex === right.rowIndex && left.columnIndex < right.columnIndex)

const getCandidate = (
  lines: readonly string[],
  rowIndex: number,
  columnIndex: number,
): { character: string; position: BracketPosition } | undefined => {
  const line = lines.at(rowIndex)
  if (line === undefined) {
    return undefined
  }
  const characterAtCursor = line[columnIndex]
  if (characterAtCursor && (isOpeningBracket(characterAtCursor) || isClosingBracket(characterAtCursor))) {
    return {
      character: characterAtCursor,
      position: { columnIndex, rowIndex },
    }
  }
  const characterBeforeCursor = line[columnIndex - 1]
  if (characterBeforeCursor && (isOpeningBracket(characterBeforeCursor) || isClosingBracket(characterBeforeCursor))) {
    return {
      character: characterBeforeCursor,
      position: { columnIndex: columnIndex - 1, rowIndex },
    }
  }
  return undefined
}

const getCharacter = (lines: readonly string[], position: BracketPosition): string => lines[position.rowIndex][position.columnIndex]

const findForward = (lines: readonly string[], source: BracketPosition): BracketPosition | undefined => {
  const { columnIndex: sourceColumnIndex, rowIndex: sourceRowIndex } = source
  const stack: string[] = [getCharacter(lines, source)]
  for (let rowIndex = sourceRowIndex; rowIndex < lines.length; rowIndex++) {
    const line = lines[rowIndex]
    const startColumnIndex = rowIndex === sourceRowIndex ? sourceColumnIndex + 1 : 0
    for (let columnIndex = startColumnIndex; columnIndex < line.length; columnIndex++) {
      const character = line[columnIndex]
      if (isOpeningBracket(character)) {
        stack.push(character)
      } else if (isClosingBracket(character)) {
        const expectedOpeningBracket = openingBrackets[character]
        if (stack.at(-1) !== expectedOpeningBracket) {
          return undefined
        }
        stack.pop()
        if (stack.length === 0) {
          return { columnIndex, rowIndex }
        }
      }
    }
  }
  return undefined
}

const findBackward = (lines: readonly string[], source: BracketPosition): BracketPosition | undefined => {
  const { columnIndex: sourceColumnIndex, rowIndex: sourceRowIndex } = source
  const stack: string[] = [getCharacter(lines, source)]
  for (let rowIndex = sourceRowIndex; rowIndex >= 0; rowIndex--) {
    const line = lines[rowIndex]
    let startColumnIndex = line.length - 1
    if (rowIndex === sourceRowIndex) {
      startColumnIndex = sourceColumnIndex - 1
    }
    for (let columnIndex = startColumnIndex; columnIndex >= 0; columnIndex--) {
      const character = line[columnIndex]
      if (isClosingBracket(character)) {
        stack.push(character)
      } else if (isOpeningBracket(character)) {
        const expectedClosingBracket = closingBrackets[character]
        if (stack.at(-1) !== expectedClosingBracket) {
          return undefined
        }
        stack.pop()
        if (stack.length === 0) {
          return { columnIndex, rowIndex }
        }
      }
    }
  }
  return undefined
}

export const findMatchingBracket = (lines: readonly string[], rowIndex: number, columnIndex: number): BracketPair | undefined => {
  const candidate = getCandidate(lines, rowIndex, columnIndex)
  if (!candidate) {
    return undefined
  }
  const { character, position: source } = candidate
  const match = isOpeningBracket(character) ? findForward(lines, source) : findBackward(lines, source)
  if (!match) {
    return undefined
  }
  return {
    match,
    source,
    sourceIsBeforeCursor: source.columnIndex === columnIndex - 1 && source.rowIndex === rowIndex,
  }
}

export const findEnclosingBrackets = (lines: readonly string[], rowIndex: number, columnIndex: number): BracketPair | undefined => {
  const cursor = { columnIndex, rowIndex }
  const stack: { character: string; position: BracketPosition }[] = []
  let enclosingPair: BracketPair | undefined
  for (let currentRowIndex = 0; currentRowIndex < lines.length; currentRowIndex++) {
    const line = lines[currentRowIndex]
    for (let currentColumnIndex = 0; currentColumnIndex < line.length; currentColumnIndex++) {
      const character = line[currentColumnIndex]
      const position = { columnIndex: currentColumnIndex, rowIndex: currentRowIndex }
      if (isOpeningBracket(character)) {
        stack.push({ character, position })
      } else if (isClosingBracket(character)) {
        const openingBracket = stack.at(-1)
        if (!openingBracket || openingBracket.character !== openingBrackets[character]) {
          stack.length = 0
        } else {
          stack.pop()
          if (!enclosingPair && isBefore(openingBracket.position, cursor) && isBefore(cursor, position)) {
            enclosingPair = {
              match: position,
              source: openingBracket.position,
              sourceIsBeforeCursor: false,
            }
          }
        }
      }
    }
  }
  return enclosingPair
}

export const findNextBracket = (lines: readonly string[], rowIndex: number, columnIndex: number): BracketPosition | undefined => {
  for (let currentRowIndex = rowIndex; currentRowIndex < lines.length; currentRowIndex++) {
    const line = lines[currentRowIndex]
    const startColumnIndex = currentRowIndex === rowIndex ? columnIndex : 0
    for (let currentColumnIndex = startColumnIndex; currentColumnIndex < line.length; currentColumnIndex++) {
      const character = line[currentColumnIndex]
      if (isOpeningBracket(character) || isClosingBracket(character)) {
        return { columnIndex: currentColumnIndex, rowIndex: currentRowIndex }
      }
    }
  }
  return undefined
}

export const findBracketPair = (lines: readonly string[], rowIndex: number, columnIndex: number): BracketPair | undefined => {
  const directPair = findMatchingBracket(lines, rowIndex, columnIndex)
  if (directPair) {
    return directPair
  }
  const enclosingPair = findEnclosingBrackets(lines, rowIndex, columnIndex)
  if (enclosingPair) {
    return enclosingPair
  }
  const nextBracket = findNextBracket(lines, rowIndex, columnIndex)
  if (!nextBracket) {
    return undefined
  }
  return findMatchingBracket(lines, nextBracket.rowIndex, nextBracket.columnIndex)
}
