import { expect, test } from '@jest/globals'
import * as GetMinimapRectangles from '../src/parts/GetMinimapRectangles/GetMinimapRectangles.ts'

test('creates token blocks and a viewport overlay', () => {
  const state = {
    deltaY: 40,
    finalDeltaY: 80,
    height: 100,
    minimapLines: [
      [2, 'Token Whitespace', 4, 'Token Keyword'],
      [6, 'Token String'],
    ],
    numberOfVisibleLines: 1,
  }

  expect(GetMinimapRectangles.getMinimapRectangles(state as any)).toEqual([
    {
      className: 'Token Keyword',
      height: 2,
      width: 3,
      x: 1.5,
      y: 0,
    },
    {
      className: 'Token String',
      height: 2,
      width: 4.5,
      x: 0,
      y: 2,
    },
    {
      className: 'EditorMinimapViewport',
      height: 50,
      width: 120,
      x: 0,
      y: 25,
    },
  ])
})

test('compresses long documents to fit the canvas height', () => {
  const state = {
    deltaY: 0,
    finalDeltaY: 0,
    height: 2,
    minimapLines: [
      [1, 'Token Keyword'],
      [1, 'Token Keyword'],
      [1, 'Token Keyword'],
      [1, 'Token Keyword'],
    ],
    numberOfVisibleLines: 1,
  }

  const rectangles = GetMinimapRectangles.getMinimapRectangles(state as any)

  expect(rectangles.slice(0, 4).map(({ height, y }) => ({ height, y }))).toEqual([
    { height: 0.5, y: 0 },
    { height: 0.5, y: 0.5 },
    { height: 0.5, y: 1 },
    { height: 0.5, y: 1.5 },
  ])
})
