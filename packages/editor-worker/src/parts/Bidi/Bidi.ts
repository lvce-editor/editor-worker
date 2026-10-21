import type { Bidi as BidiApi } from 'bidi-js'
import bidiFactoryModule from 'bidi-js'

// bidi-js ships ES module declarations for a CommonJS package; its runtime
// default export is the factory in both Node and the browser bundle.
const bidiFactory = bidiFactoryModule as unknown as () => BidiApi

export type BidiMeasure = (text: string, context?: { readonly text: string; readonly offset: number; readonly rtl: boolean }) => Promise<number>

export interface BidiRun {
  readonly end: number
  readonly level: number
  readonly start: number
}

// Keep the paragraph LTR, as in source code. Individual RTL runs still shape RTL.
// Do not initialize the Unicode tables or segment ASCII lines.
const state: { bidi?: ReturnType<typeof bidiFactory> } = {}
const rtlCharacters = /[\u{590}-\u{8FF}\u{200F}\u{202A}-\u{202E}\u{2066}-\u{2069}\u{FB1D}-\u{FDFF}\u{FE70}-\u{FEFF}]|\p{Script=Adlam}/u

export const isBidi = (line: string, enabled = false): boolean => enabled && rtlCharacters.test(line)

export const getRuns = (line: string): readonly BidiRun[] => {
  const bidi = (state.bidi ??= bidiFactory())
  const embedding = bidi.getEmbeddingLevels(line, 'ltr')
  const order = bidi.getReorderedIndices(line, embedding)
  const runs: { start: number; end: number; level: number }[] = []
  let previousIndex = -2
  for (const index of order) {
    const previous = runs.at(-1)
    const level = embedding.levels[index]
    if (previous && previous.level === level && Math.abs(index - previousIndex) === 1) {
      previous.start = Math.min(previous.start, index)
      previous.end = Math.max(previous.end, index + 1)
    } else {
      runs.push({ end: index + 1, level, start: index })
    }
    previousIndex = index
  }
  return runs
}

const getBoundaries = (line: string): readonly number[] => {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  return [...Array.from(segmenter.segment(line), ({ index }) => index), line.length]
}

// A basic editor has one caret per logical column. At an ambiguous boundary,
// prefer the higher embedding level (the RTL side at ordinary LTR/RTL edges).
export const getCaretRun = (runs: readonly BidiRun[], column: number): BidiRun => {
  let result = runs[0]
  for (const run of runs) {
    if (column >= run.start && column <= run.end && (column < result.start || column > result.end || run.level > result.level)) {
      result = run
    }
  }
  return result
}

export const getVisualColumns = (line: string): readonly number[] => {
  const boundaries = getBoundaries(line)
  if (!isBidi(line, true)) {
    return boundaries
  }
  const runs = getRuns(line)
  const logicalRuns = runs.toSorted((left, right) => left.start - right.start)
  const columnsByRun = new Map<BidiRun, number[]>(runs.map((run) => [run, []]))
  let runIndex = 0
  for (const column of boundaries) {
    while (runIndex + 1 < logicalRuns.length && column >= logicalRuns[runIndex + 1].start) {
      runIndex++
    }
    const current = logicalRuns[runIndex]
    const previous = logicalRuns[runIndex - 1]
    const owner = previous && column === current.start && previous.level > current.level ? previous : current
    columnsByRun.get(owner)!.push(column)
  }
  const columns: number[] = []
  for (const run of runs) {
    const part = columnsByRun.get(run)!
    const orderedColumns = run.level % 2 ? part.toReversed() : part
    for (const column of orderedColumns) {
      columns.push(column)
    }
  }
  return columns
}

export const getPosition = async (
  line: string,
  column: number,
  measure: BidiMeasure,
  runs = getRuns(line),
  selectedRun = getCaretRun(runs, column),
): Promise<number> => {
  let x = 0
  for (const run of runs) {
    const text = line.slice(run.start, run.end)
    const width = await measure(text)
    if (run === selectedRun) {
      const prefix = await measure(line.slice(run.start, column), { offset: column - run.start, rtl: run.level % 2 === 1, text })
      return x + (run.level % 2 ? width - prefix : prefix)
    }
    x += width
  }
  return x
}

export const getColumn = async (line: string, x: number, measure: BidiMeasure): Promise<number> => {
  const columns = getVisualColumns(line)
  // Binary search the same canonical positions used by the caret, including
  // both line edges. This also keeps clicks out of combining sequences.
  const runs = getRuns(line)
  let low = 0
  let high = columns.length - 1
  while (low < high) {
    const middle = Math.floor((low + high) / 2)
    const left = await getPosition(line, columns[middle], measure, runs)
    const right = await getPosition(line, columns[middle + 1], measure, runs)
    if (x < (left + right) / 2) {
      high = middle
    } else {
      low = middle + 1
    }
  }
  return columns[low]
}

export const getSelectionRanges = async (
  line: string,
  start: number,
  end: number,
  measure: BidiMeasure,
): Promise<readonly { readonly x: number; readonly width: number }[]> => {
  const runs = getRuns(line)
  const ranges = []
  let x = 0
  for (const run of runs) {
    const text = line.slice(run.start, run.end)
    const width = await measure(text)
    const from = Math.max(start, run.start)
    const to = Math.min(end, run.end)
    if (from < to) {
      const leftPrefix = await measure(line.slice(run.start, from), { offset: from - run.start, rtl: run.level % 2 === 1, text })
      const rightPrefix = await measure(line.slice(run.start, to), { offset: to - run.start, rtl: run.level % 2 === 1, text })
      const left = run.level % 2 ? width - leftPrefix : leftPrefix
      const right = run.level % 2 ? width - rightPrefix : rightPrefix
      ranges.push({ width: Math.abs(right - left), x: x + Math.min(left, right) })
    }
    x += width
  }
  return ranges
}
