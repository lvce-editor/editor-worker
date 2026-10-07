export interface HorizontalVisibleRange {
  readonly end: number
  readonly start: number
}

const getCharacterWidth = (character: string, tabSize: number): number => {
  return character === '\t' ? tabSize : character.length
}

export const getHorizontalDisplayColumn = (line: string, sourceColumn: number, tabSize: number): number => {
  const prefix = line.slice(0, sourceColumn)
  return prefix.replaceAll('\t', () => ' '.repeat(tabSize)).length
}

export const getHorizontalVisibleRange = (
  line: string,
  deltaX: number,
  width: number,
  averageCharWidth: number,
  tabSize: number,
): HorizontalVisibleRange => {
  const charWidth = averageCharWidth > 0 ? averageCharWidth : 1
  const scrollOffset = Math.max(0, Number.isFinite(deltaX) ? deltaX : 0)
  const viewportWidth = Number.isFinite(width) ? Math.max(0, width) : Infinity
  const targetStart = scrollOffset / charWidth
  const targetEnd = (scrollOffset + viewportWidth) / charWidth
  let column = 0
  let index = 0
  let start = 0
  let started = false
  for (const character of line) {
    const nextColumn = column + getCharacterWidth(character, tabSize)
    if (!started && nextColumn <= targetStart) {
      column = nextColumn
      index += character.length
      start = index
      continue
    }
    if (!started) {
      start = index
      started = true
    }
    index += character.length
    column = nextColumn
    if (column >= targetEnd) {
      break
    }
  }
  if (!started) {
    start = index
  }
  // Keep one extra code point to cover fractional offsets and avoid a blank edge.
  if (index < line.length) {
    const nextCodePoint = String.fromCodePoint(line.codePointAt(index)!)
    index += nextCodePoint.length
  }
  return {
    end: index,
    start,
  }
}

export const getHorizontalVisibleDifference = (line: string, start: number, deltaX: number, averageCharWidth: number, tabSize: number): number => {
  const charWidth = averageCharWidth > 0 ? averageCharWidth : 1
  const scrollOffset = Number.isFinite(deltaX) ? deltaX : 0
  return getHorizontalDisplayColumn(line, start, tabSize) * charWidth - scrollOffset
}
