import { expect, jest, test } from '@jest/globals'
import * as GetHorizontalVisibleRange from '../src/parts/GetHorizontalVisibleRange/GetHorizontalVisibleRange.ts'

test('keeps lines at or below the configured threshold on the normal rendering path', () => {
  expect(GetHorizontalVisibleRange.getHorizontalVisibleRange('short', 0, 2, 1, 2, 5)).toEqual({
    end: 5,
    start: 0,
  })
})

test('clips long lines around the horizontally scrolled viewport with overscan', () => {
  expect(GetHorizontalVisibleRange.getHorizontalVisibleRange('0123456789', 4, 3, 1, 2, 5)).toEqual({
    end: 8,
    start: 4,
  })
})

test('never splits a combining sequence or a multi-code-point emoji', () => {
  const line = 'a\u{65}\u{301}b👩‍💻cdef'
  const { end, start } = GetHorizontalVisibleRange.getHorizontalVisibleRange(line, 2, 1, 1, 2, 5)
  expect(line.slice(start, end)).toBe('b👩‍💻')
})

test('uses supplied worker grapheme boundaries for display columns and ranges', () => {
  const line = 'a\u{301}\u{1F469}\u{200D}\u{1F4BB}bcdef'
  const segments = [0, 2, 7, 8, 9, 10, 11, 12]
  expect(GetHorizontalVisibleRange.getHorizontalDisplayColumn(line, 7, 2, segments)).toBe(7)
  expect(GetHorizontalVisibleRange.getHorizontalVisibleRange(line, 2, 1, 1, 2, 5, segments)).toEqual({
    end: 9,
    start: 7,
  })
})

test('uses measured prefix widths for proportional text and partial tokens', async () => {
  const line = 'abWXYZ'
  const characterWidths: Record<string, number> = { a: 1, b: 3, W: 4, X: 2, Y: 2, Z: 2 }
  const measureWidth = async (text: string) => [...text].reduce((total, character) => total + (characterWidths[character] || 0), 0)
  const range = await GetHorizontalVisibleRange.getHorizontalVisibleRangeMeasured(line, 4, 2, 1, 2, 2, measureWidth)
  expect(range).toEqual({ difference: 0, end: 4, start: 2 })
})

test('keeps worker grapheme boundaries when measuring long rows', async () => {
  const line = 'a\u{301}\u{1F469}\u{200D}\u{1F4BB}bcdef'
  const segments = [0, 2, 7, 8, 9, 10, 11, 12]
  const [range] = await GetHorizontalVisibleRange.getHorizontalVisibleRangesMeasured(
    [{ averageCharWidth: 1, deltaX: 2, line, segments, tabSize: 2, threshold: 5, width: 1 }],
    async (texts) => texts.map((text) => [...text].length),
  )
  const boundaries = new Set(segments)
  expect(boundaries.has(range.start)).toBe(true)
  expect(boundaries.has(range.end)).toBe(true)
})

test('batches independent prefix searches across long rows', async () => {
  const lines = ['abWXYZ', 'aWbXYZ']
  const characterWidths: Record<string, number> = { a: 1, b: 3, W: 4, X: 2, Y: 2, Z: 2 }
  const batches: string[][] = []
  const measureWidths = async (texts: readonly string[]) => {
    batches.push([...texts])
    return texts.map((text) => [...text].reduce((total, character) => total + (characterWidths[character] || 0), 0))
  }
  const ranges = await GetHorizontalVisibleRange.getHorizontalVisibleRangesMeasured(
    lines.map((line) => ({ averageCharWidth: 1, deltaX: 4, line, tabSize: 2, threshold: 2, width: 2 })),
    measureWidths,
  )
  expect(ranges).toEqual([
    { difference: 0, end: 4, start: 2 },
    { difference: -3, end: 4, start: 1 },
  ])
  expect(batches.some((batch) => batch.length > 1)).toBe(true)
})

test('keeps short rows off the measurement worker and returns an empty result for no rows', async () => {
  const measureWidths = jest.fn(async (texts: readonly string[]) => texts.map((text) => text.length))
  await expect(
    GetHorizontalVisibleRange.getHorizontalVisibleRangesMeasured(
      [{ averageCharWidth: 1, deltaX: 0, line: 'short', tabSize: 2, threshold: 5, width: 10 }],
      measureWidths,
    ),
  ).resolves.toEqual([{ difference: 0, end: 5, start: 0 }])
  await expect(GetHorizontalVisibleRange.getHorizontalVisibleRangesMeasured([], measureWidths)).resolves.toEqual([])
  expect(measureWidths).not.toHaveBeenCalled()
})

test('batches long rows when short rows share the viewport', async () => {
  const measureWidths = jest.fn(async (texts: readonly string[]) => texts.map((text) => text.length))
  const ranges = await GetHorizontalVisibleRange.getHorizontalVisibleRangesMeasured(
    [
      { averageCharWidth: 1, deltaX: 0, line: 'short', tabSize: 2, threshold: 5, width: 10 },
      { averageCharWidth: 1, deltaX: 4, line: '0123456789', tabSize: 2, threshold: 5, width: 3 },
    ],
    measureWidths,
  )
  expect(ranges[0]).toEqual({ difference: 0, end: 5, start: 0 })
  expect(ranges[1].start).toBe(4)
  expect(measureWidths).toHaveBeenCalled()
})

test('falls back to approximate ranges when a measurement batch fails', async () => {
  await expect(
    GetHorizontalVisibleRange.getHorizontalVisibleRangesMeasured(
      [{ averageCharWidth: 1, deltaX: 4, line: '0123456789', tabSize: 2, threshold: 5, width: 3 }],
      async () => {
        throw new Error('worker unavailable')
      },
    ),
  ).resolves.toEqual([{ difference: 0, end: 8, start: 4 }])
})
