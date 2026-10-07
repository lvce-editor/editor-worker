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
  const fallback = (): { readonly difference: number; readonly end: number; readonly start: number } => {
    const range = getHorizontalVisibleRange(line, deltaX, width, averageCharWidth, tabSize, threshold)
    return {
      ...range,
      difference: getHorizontalVisibleDifference(line, range.start, deltaX, averageCharWidth, tabSize),
    }
  }
  if (line.length <= threshold) {
    return fallback()
  }
  const scrollOffset = Math.max(0, Number.isFinite(deltaX) ? deltaX : 0)
  const viewportWidth = Number.isFinite(width) ? Math.max(0, width) : Infinity
  const segments = getSegments(line)
  const boundaries = [0, ...segments.map(({ index, segment }) => index + segment.length)]
  const measurements = new Map<number, number>([[0, 0]])
  const measureBoundary = async (boundaryIndex: number): Promise<number> => {
    const cached = measurements.get(boundaryIndex)
    if (cached !== undefined) {
      return cached
    }
    const prefix = line.slice(0, boundaries[boundaryIndex]).replaceAll('\t', () => ' '.repeat(tabSize))
    const measured = await measureWidth(prefix)
    measurements.set(boundaryIndex, measured)
    return measured
  }
  const findGreatestBoundaryAtMost = async (target: number): Promise<number> => {
    let low = 0
    let high = boundaries.length
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      if ((await measureBoundary(middle)) <= target) {
        low = middle + 1
      } else {
        high = middle
      }
    }
    return Math.max(0, low - 1)
  }
  const findFirstBoundaryAtLeast = async (target: number): Promise<number> => {
    let low = 0
    let high = boundaries.length
    while (low < high) {
      const middle = Math.floor((low + high) / 2)
      if ((await measureBoundary(middle)) < target) {
        low = middle + 1
      } else {
        high = middle
      }
    }
    return Math.min(boundaries.length - 1, low)
  }
  try {
    const startBoundary = await findGreatestBoundaryAtMost(scrollOffset)
    const endBoundary = await findFirstBoundaryAtLeast(scrollOffset + viewportWidth)
    const start = boundaries[startBoundary]
    let end = boundaries[endBoundary]
    if (end < line.length) {
      end = boundaries[Math.min(boundaries.length - 1, endBoundary + 1)]
    }
    return {
      difference: (await measureBoundary(startBoundary)) - scrollOffset,
      end,
      start,
    }
  } catch {
    return fallback()
  }
}

export const getHorizontalVisibleDifference = (line: string, start: number, deltaX: number, averageCharWidth: number, tabSize: number): number => {
  const charWidth = averageCharWidth > 0 ? averageCharWidth : 1
  const scrollOffset = Number.isFinite(deltaX) ? deltaX : 0
  return getHorizontalDisplayColumn(line, start, tabSize) * charWidth - scrollOffset
}
