export interface HorizontalVisibleRange {
  readonly end: number
  readonly segments?: readonly number[]
  readonly start: number
}

const defaultThreshold = 500

const getSegments = (line: string): readonly number[] => {
  if (typeof Intl.Segmenter === 'function') {
    // @ts-ignore
    return [...Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(line), ({ index }) => index), line.length]
  }
  const segments = [0]
  let index = 0
  for (const segment of line) {
    index += segment.length
    segments.push(index)
  }
  return segments
}

const getCharacterWidth = (line: string, start: number, end: number, tabSize: number): number => {
  if (end - start === 1 && line.codePointAt(start) === 9) {
    return tabSize
  }
  // Grapheme clusters such as combining characters and ZWJ emoji are indivisible.
  // Treat each cluster as one display column; the extra cluster below is a safe overscan.
  return 1
}

export const getHorizontalDisplayColumn = (
  line: string,
  sourceColumn: number,
  tabSize: number,
  segments: readonly number[] = getSegments(line),
): number => {
  let displayColumn = 0
  for (let i = 0; i < segments.length - 1; i++) {
    const start = segments[i]
    const end = segments[i + 1]
    if (end > sourceColumn) {
      break
    }
    displayColumn += end - start === 1 && line.codePointAt(start) === 9 ? tabSize : end - start
  }
  return displayColumn
}

export const getHorizontalVisibleRange = (
  line: string,
  deltaX: number,
  width: number,
  averageCharWidth: number,
  tabSize: number,
  threshold = defaultThreshold,
  segments: readonly number[] = getSegments(line),
): HorizontalVisibleRange => {
  if (line.length <= threshold) {
    return { end: line.length, start: 0 }
  }
  const charWidth = averageCharWidth > 0 ? averageCharWidth : 1
  const scrollOffset = Math.max(0, Number.isFinite(deltaX) ? deltaX : 0)
  const viewportWidth = Number.isFinite(width) ? Math.max(0, width) : Infinity
  const targetStart = scrollOffset / charWidth
  const targetEnd = (scrollOffset + viewportWidth) / charWidth
  let column = 0
  let index = 0
  let start = 0
  let started = false
  for (let i = 0; i < segments.length - 1; i++) {
    const segmentIndex = segments[i]
    const segmentEnd = segments[i + 1]
    const nextColumn = column + getCharacterWidth(line, segmentIndex, segmentEnd, tabSize)
    if (!started && nextColumn <= targetStart) {
      column = nextColumn
      index = segmentEnd
      start = index
      continue
    }
    if (!started) {
      start = segmentIndex
      started = true
    }
    index = segmentEnd
    column = nextColumn
    if (column >= targetEnd) {
      break
    }
  }
  if (!started) {
    start = index
  }
  // Keep one extra complete grapheme to cover fractional offsets and avoid a blank edge.
  if (index < line.length) {
    const nextSegmentIndex = segments.findIndex((segmentIndex) => segmentIndex >= index)
    if (nextSegmentIndex !== -1 && nextSegmentIndex < segments.length - 1) {
      index = segments[nextSegmentIndex + 1]
    }
  }
  return {
    end: index,
    start,
  }
}

export const getHorizontalVisibleRangeMeasured = async (
  line: string,
  deltaX: number,
  width: number,
  averageCharWidth: number,
  tabSize: number,
  threshold: number,
  measureWidth: (text: string) => Promise<number>,
): Promise<{ readonly difference: number; readonly end: number; readonly start: number }> => {
  const [range] = await getHorizontalVisibleRangesMeasured([{ averageCharWidth, deltaX, line, tabSize, threshold, width }], async (texts) =>
    Promise.all(texts.map(measureWidth)),
  )
  return range
}

interface MeasuredRangeRequest {
  readonly averageCharWidth: number
  readonly deltaX: number
  readonly line: string
  readonly segments?: readonly number[]
  readonly tabSize: number
  readonly threshold: number
  readonly width: number
}

interface SearchCursor {
  high: number
  readonly isStart: boolean
  readonly lineIndex: number
  low: number
  readonly target: number
}

export const getHorizontalVisibleRangesMeasured = async (
  requests: readonly MeasuredRangeRequest[],
  measureWidths: (texts: readonly string[]) => Promise<readonly number[]>,
): Promise<readonly { readonly difference: number; readonly end: number; readonly start: number }[]> => {
  const fallback = (request: MeasuredRangeRequest) => {
    const segments = request.segments || getSegments(request.line)
    const range = getHorizontalVisibleRange(
      request.line,
      request.deltaX,
      request.width,
      request.averageCharWidth,
      request.tabSize,
      request.threshold,
      segments,
    )
    return {
      ...range,
      difference: getHorizontalVisibleDifference(request.line, range.start, request.deltaX, request.averageCharWidth, request.tabSize, segments),
    }
  }
  const results = requests.map((request) => fallback(request))
  const boundariesByLine: (readonly number[])[] = []
  const measurementsByLine: Map<number, number>[] = []
  const cursors: SearchCursor[] = []
  for (let lineIndex = 0; lineIndex < requests.length; lineIndex++) {
    const request = requests[lineIndex]
    if (request.line.length <= request.threshold) {
      continue
    }
    const boundaries = request.segments || getSegments(request.line)
    boundariesByLine[lineIndex] = boundaries
    measurementsByLine[lineIndex] = new Map([[0, 0]])
    const scrollOffset = Math.max(0, Number.isFinite(request.deltaX) ? request.deltaX : 0)
    const viewportWidth = Number.isFinite(request.width) ? Math.max(0, request.width) : Infinity
    cursors.push({ high: boundaries.length, isStart: true, lineIndex, low: 0, target: scrollOffset })
    cursors.push({ high: boundaries.length, isStart: false, lineIndex, low: 0, target: scrollOffset + viewportWidth })
  }
  try {
    const addPendingMeasurement = (cursor: SearchCursor, pending: Map<string, { lineIndex: number; boundaryIndex: number; text: string }>) => {
      if (cursor.low >= cursor.high) {
        return
      }
      const boundaryIndex = Math.floor((cursor.low + cursor.high) / 2)
      if (measurementsByLine[cursor.lineIndex].has(boundaryIndex)) {
        return
      }
      const request = requests[cursor.lineIndex]
      const prefix = request.line.slice(0, boundariesByLine[cursor.lineIndex][boundaryIndex]).replaceAll('\t', () => ' '.repeat(request.tabSize))
      pending.set(`${cursor.lineIndex}:${boundaryIndex}`, { boundaryIndex, lineIndex: cursor.lineIndex, text: prefix })
    }
    const updateCursor = (cursor: SearchCursor) => {
      if (cursor.low >= cursor.high) {
        return
      }
      const middle = Math.floor((cursor.low + cursor.high) / 2)
      const measured = measurementsByLine[cursor.lineIndex].get(middle)
      if (measured === undefined) {
        return
      }
      if (cursor.isStart ? measured <= cursor.target : measured < cursor.target) {
        cursor.low = middle + 1
      } else {
        cursor.high = middle
      }
    }
    while (cursors.some(({ high, low }) => low < high)) {
      const pending = new Map<string, { lineIndex: number; boundaryIndex: number; text: string }>()
      for (const cursor of cursors) {
        addPendingMeasurement(cursor, pending)
      }
      if (pending.size > 0) {
        const entries = pending.values().toArray()
        const measuredWidths = await measureWidths(entries.map(({ text }) => text))
        if (measuredWidths.length !== entries.length) {
          throw new Error('Text measurement returned an unexpected number of widths')
        }
        for (let i = 0; i < entries.length; i++) {
          const { boundaryIndex, lineIndex } = entries[i]
          measurementsByLine[lineIndex].set(boundaryIndex, measuredWidths[i])
        }
      }
      for (const cursor of cursors) {
        updateCursor(cursor)
      }
    }
    for (let lineIndex = 0; lineIndex < boundariesByLine.length; lineIndex++) {
      const boundaries = boundariesByLine[lineIndex]
      if (!boundaries) {
        continue
      }
      const request = requests[lineIndex]
      const lineCursors = cursors.filter((cursor) => cursor.lineIndex === lineIndex)
      const startBoundary = Math.max(0, lineCursors[0].low - 1)
      const endBoundary = Math.min(boundaries.length - 1, lineCursors[1].low)
      const start = boundaries[startBoundary]
      let end = boundaries[endBoundary]
      if (end < request.line.length) {
        end = boundaries[Math.min(boundaries.length - 1, endBoundary + 1)]
      }
      const scrollOffset = Math.max(0, Number.isFinite(request.deltaX) ? request.deltaX : 0)
      results[lineIndex] = {
        difference: (measurementsByLine[lineIndex].get(startBoundary) ?? 0) - scrollOffset,
        end,
        start,
      }
    }
  } catch {
    // Keep the existing approximate range fallback when worker measurement fails.
  }
  return results
}

export const getHorizontalVisibleDifference = (
  line: string,
  start: number,
  deltaX: number,
  averageCharWidth: number,
  tabSize: number,
  segments?: readonly number[],
): number => {
  const charWidth = averageCharWidth > 0 ? averageCharWidth : 1
  const scrollOffset = Number.isFinite(deltaX) ? deltaX : 0
  return getHorizontalDisplayColumn(line, start, tabSize, segments) * charWidth - scrollOffset
}
