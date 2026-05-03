import { expect, test } from '@jest/globals'
import * as Resize from '../src/parts/Resize/Resize.ts'

test('resize updates bounds and visible lines', () => {
  const state = {
    columnWidth: 9,
    deltaY: 0,
    finalDeltaY: 60,
    finalY: 3,
    height: 40,
    itemHeight: 20,
    lines: ['a', 'b', 'c', 'd', 'e'],
    maxLineY: 2,
    minLineY: 0,
    minimumSliderSize: 20,
    numberOfVisibleLines: 2,
    rowHeight: 20,
    scrollBarHeight: 20,
    width: 100,
    x: 1,
    y: 2,
  }

  expect(Resize.resize(state, { x: 10, y: 20, width: 120, height: 60 })).toEqual({
    columnWidth: 9,
    deltaY: 0,
    finalDeltaY: 40,
    finalY: 2,
    height: 60,
    itemHeight: 20,
    lines: ['a', 'b', 'c', 'd', 'e'],
    maxLineY: 3,
    minLineY: 0,
    minimumSliderSize: 20,
    numberOfVisibleLines: 3,
    rowHeight: 20,
    scrollBarHeight: 36,
    width: 120,
    x: 10,
    y: 20,
  })
})

test('resize clamps scroll position when height increases', () => {
  const state = {
    columnWidth: 9,
    deltaY: 1800,
    finalDeltaY: 1800,
    finalY: 90,
    height: 200,
    itemHeight: 20,
    lines: Array.from({ length: 100 }, (_, index) => `${index}`),
    maxLineY: 100,
    minLineY: 90,
    minimumSliderSize: 20,
    numberOfVisibleLines: 10,
    rowHeight: 20,
    scrollBarHeight: 20,
    width: 100,
    x: 1,
    y: 2,
  }

  expect(Resize.resize(state, { height: 400 })).toEqual({
    columnWidth: 9,
    deltaY: 1600,
    finalDeltaY: 1600,
    finalY: 80,
    height: 400,
    itemHeight: 20,
    lines: Array.from({ length: 100 }, (_, index) => `${index}`),
    maxLineY: 100,
    minLineY: 80,
    minimumSliderSize: 20,
    numberOfVisibleLines: 20,
    rowHeight: 20,
    scrollBarHeight: 80,
    width: 100,
    x: 1,
    y: 2,
  })
})
