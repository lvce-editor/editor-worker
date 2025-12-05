import { expect, test } from '@jest/globals'
import * as ScrollBarFunctions from '../src/parts/ScrollBarFunctions/ScrollBarFunctions.ts'

test('getNewDeltaPercent - clicked at top', () => {
  const height = 100
  const scrollBarHeight = 20
  const relativeY = 1
  expect(ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)).toEqual({
    handleOffset: 1,
    percent: 0,
  })
})

test('getNewDeltaPercent - clicked in middle', () => {
  const height = 100
  const scrollBarHeight = 20
  const relativeY = 20
  expect(ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)).toEqual({
    handleOffset: 10,
    percent: 0.125,
  })
})

test('getNewDeltaPercent - clicked at bottom', () => {
  const height = 100
  const scrollBarHeight = 20
  const relativeY = 91
  expect(ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)).toEqual({
    handleOffset: 11,
    percent: 1,
  })
})
