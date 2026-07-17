import * as Clamp from '../Clamp/Clamp.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

export interface FoldingRange {
  readonly end: number
  readonly start: number
}

const getSortedRanges = (ranges: readonly FoldingRange[]): readonly FoldingRange[] => {
  return ranges.toSorted((a, b) => a.start - b.start || b.end - a.end)
}

export const isRowHidden = (rowIndex: number, ranges: readonly FoldingRange[]): boolean => {
  for (const range of ranges) {
    if (rowIndex > range.start && rowIndex <= range.end) {
      return true
    }
  }
  return false
}

export const getUnhiddenRow = (rowIndex: number, previousRowIndex: number, lineCount: number, ranges: readonly FoldingRange[]): number => {
  for (const range of ranges) {
    if (rowIndex > range.start && rowIndex <= range.end) {
      return rowIndex >= previousRowIndex ? Math.min(range.end + 1, lineCount - 1) : range.start
    }
  }
  return rowIndex
}

export const getVisibleLineCount = (lineCount: number, ranges: readonly FoldingRange[]): number => {
  let hidden = 0
  let hiddenUntil = -1
  for (const range of getSortedRanges(ranges)) {
    const start = Math.max(range.start + 1, hiddenUntil + 1)
    const end = Math.min(range.end, lineCount - 1)
    if (start <= end) {
      hidden += end - start + 1
      hiddenUntil = end
    }
  }
  return lineCount - hidden
}

export const getVisualRowForDocumentRow = (rowIndex: number, ranges: readonly FoldingRange[]): number => {
  let hiddenBefore = 0
  for (const range of getSortedRanges(ranges)) {
    if (rowIndex <= range.start) {
      break
    }
    if (rowIndex <= range.end) {
      return range.start - hiddenBefore
    }
    hiddenBefore += range.end - range.start
  }
  return rowIndex - hiddenBefore
}

export const getDocumentRowForVisualRow = (visualRow: number, ranges: readonly FoldingRange[]): number => {
  let documentRow = visualRow
  let hiddenBefore = 0
  for (const range of getSortedRanges(ranges)) {
    const rangeVisualRow = range.start - hiddenBefore
    if (visualRow <= rangeVisualRow) {
      break
    }
    const hiddenCount = range.end - range.start
    documentRow += hiddenCount
    hiddenBefore += hiddenCount
  }
  return documentRow
}

export const getViewportLineIndices = (
  lineCount: number,
  ranges: readonly FoldingRange[],
  startVisualRow: number,
  numberOfVisibleLines: number,
): readonly number[] => {
  const visibleLineCount = getVisibleLineCount(lineCount, ranges)
  const endVisualRow = Math.min(startVisualRow + numberOfVisibleLines, visibleLineCount)
  const result: number[] = []
  for (let visualRow = startVisualRow; visualRow < endVisualRow; visualRow++) {
    result.push(getDocumentRowForVisualRow(visualRow, ranges))
  }
  return result
}

export const updateLayout = (editor: any, foldingRanges: readonly FoldingRange[]) => {
  const { height, itemHeight, lines, minimumSliderSize, numberOfVisibleLines, rowHeight } = editor
  const visibleLineCount = getVisibleLineCount(lines.length, foldingRanges)
  const finalY = Math.max(visibleLineCount - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * itemHeight
  const deltaY = Clamp.clamp(editor.deltaY, 0, finalDeltaY)
  const startVisualRow = Math.floor(deltaY / itemHeight)
  const visibleLineIndices = getViewportLineIndices(lines.length, foldingRanges, startVisualRow, numberOfVisibleLines)
  const minLineY = visibleLineIndices[0] ?? 0
  const maxLineY = visibleLineIndices.length === 0 ? 0 : visibleLineIndices.at(-1)! + 1
  const contentHeight = visibleLineCount * rowHeight
  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(height, contentHeight, minimumSliderSize)
  const scrollBarY = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  return {
    ...editor,
    deltaY,
    finalDeltaY,
    finalY,
    foldingRanges,
    maxLineY,
    minLineY,
    scrollBarHeight,
    scrollBarY,
    visibleLineIndices,
  }
}

export const addRange = (ranges: readonly FoldingRange[], range: FoldingRange): readonly FoldingRange[] => {
  if (ranges.some((existing) => existing.start <= range.start && existing.end >= range.end)) {
    return ranges
  }
  const remainingRanges = ranges.filter((existing) => range.start > existing.start || range.end < existing.end)
  return getSortedRanges([...remainingRanges, range])
}

export const removeRangeAt = (ranges: readonly FoldingRange[], rowIndex: number): readonly FoldingRange[] => {
  let bestIndex = -1
  let bestSize = Infinity
  for (let i = 0; i < ranges.length; i++) {
    if (ranges[i].start === rowIndex) {
      bestIndex = i
      break
    }
    const range = ranges[i]
    if (rowIndex >= range.start && rowIndex <= range.end && range.end - range.start < bestSize) {
      bestIndex = i
      bestSize = range.end - range.start
    }
  }
  return bestIndex === -1 ? ranges : ranges.filter((_, index) => index !== bestIndex)
}

interface ScannerState {
  blockComment: boolean
  escaped: boolean
  quote: string
}

const scanLine = (line: string, row: number, stack: number[], ranges: FoldingRange[], state: ScannerState): void => {
  for (let column = 0; column < line.length; column++) {
    const character = line[column]
    const next = line[column + 1]
    if (state.blockComment) {
      if (character === '*' && next === '/') {
        state.blockComment = false
        column++
      }
      continue
    }
    if (state.quote) {
      if (state.escaped) {
        state.escaped = false
      } else if (character === '\\') {
        state.escaped = true
      } else if (character === state.quote) {
        state.quote = ''
      }
      continue
    }
    if (character === '/' && next === '/') {
      return
    }
    if (character === '/' && next === '*') {
      state.blockComment = true
      column++
      continue
    }
    if (["'", '"', '`'].includes(character)) {
      state.quote = character
      continue
    }
    if (character === '{') {
      stack.push(row)
      continue
    }
    if (character === '}') {
      const start = stack.pop()
      if (start !== undefined && start < row) {
        ranges.push({ end: row, start })
      }
    }
  }
  if (state.quote !== '`') {
    state.quote = ''
    state.escaped = false
  }
}

export const findRange = (lines: readonly string[], rowIndex: number): FoldingRange | undefined => {
  const stack: number[] = []
  const ranges: FoldingRange[] = []
  const state: ScannerState = {
    blockComment: false,
    escaped: false,
    quote: '',
  }
  for (let row = 0; row < lines.length; row++) {
    scanLine(lines[row], row, stack, ranges, state)
  }
  return ranges.filter((range) => range.start <= rowIndex && rowIndex <= range.end).toSorted((a, b) => a.end - a.start - (b.end - b.start))[0]
}
