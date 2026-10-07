import { expect, test } from '@jest/globals'
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

test('uses measured prefix widths for proportional text and partial tokens', async () => {
  const line = 'abWXYZ'
  const characterWidths: Record<string, number> = { a: 1, b: 3, W: 4, X: 2, Y: 2, Z: 2 }
  const measureWidth = async (text: string) => [...text].reduce((total, character) => total + (characterWidths[character] || 0), 0)
  const range = await GetHorizontalVisibleRange.getHorizontalVisibleRangeMeasured(line, 4, 2, 1, 2, 2, measureWidth)
  expect(range).toEqual({ difference: 0, end: 4, start: 2 })
})
