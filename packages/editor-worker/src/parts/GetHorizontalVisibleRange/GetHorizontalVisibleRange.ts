export interface HorizontalVisibleRange {
  readonly end: number
  readonly start: number
}

const defaultThreshold = 500

const getSegments = (line: string): readonly { readonly index: number; readonly segment: string }[] => {
  if ('Segmenter' in Intl) {
    // @ts-ignore
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(line)]
  }
  const segments: { index: number; segment: string }[] = []
  let index = 0
  for (const segment of line) {
    segments.push({ index, segment })
    index += segment.length
  }
  return segments
}

const getCharacterWidth = (character: string, tabSize: number): number => {
  if (character === '\t') {
    return tabSize
  }
  // Grapheme clusters such as combining characters and ZWJ emoji are indivisible.
  // Treat each cluster as one display column; the extra cluster below is a safe overscan.
  return 1
}

export const getHorizontalDisplayColumn = (line: string, sourceColumn: number, tabSize: number): number => {
  let displayColumn = 0
  for (const { index, segment } of getSegments(line)) {
    if (index + segment.length > sourceColumn) {
      break
    }
    displayColumn += segment === '\t' ? tabSize : segment.length
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
  const segments = getSegments(line)
  for (const { index: segmentIndex, segment } of segments) {
    const nextColumn = column + getCharacterWidth(segment, tabSize)
    if (!started && nextColumn <= targetStart) {
      column = nextColumn
      index = segmentIndex + segment.length
      start = index
      continue
    }
    if (!started) {
      start = segmentIndex
      started = true
    }
    index = segmentIndex + segment.length
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
    const nextSegment = segments.find(({ index: segmentIndex }) => segmentIndex >= index)
    if (nextSegment) {
      index = nextSegment.index + nextSegment.segment.length
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
    const range = getHorizontalVisibleRange(request.line, request.deltaX, request.width, request.averageCharWidth, request.tabSize, request.threshold)
    return {
      ...range,
      difference: getHorizontalVisibleDifference(request.line, range.start, request.deltaX, request.averageCharWidth, request.tabSize),
    }
  }
  const results = requests.map((request) => fallback(request))
  const boundariesByLine: number[][] = []
  const measurementsByLine: Map<number, number>[] = []
  const cursors: SearchCursor[] = []
  for (let lineIndex = 0; lineIndex < requests.length; lineIndex++) {
    const request = requests[lineIndex]
    if (request.line.length <= request.threshold) {
      continue
    }
    const segments = getSegments(request.line)
    const boundaries = [0, ...segments.map(({ index, segment }) => index + segment.length)]
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

export const getHorizontalVisibleDifference = (line: string, start: number, deltaX: number, averageCharWidth: number, tabSize: number): number => {
  const charWidth = averageCharWidth > 0 ? averageCharWidth : 1
  const scrollOffset = Number.isFinite(deltaX) ? deltaX : 0
  return getHorizontalDisplayColumn(line, start, tabSize) * charWidth - scrollOffset
}
