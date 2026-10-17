import { expect, jest, test } from '@jest/globals'
import { handleScrollBarHorizontalMove } from '../src/parts/EditorCommand/EditorCommandHandleScrollBarHorizontalMove.ts'
import { handleScrollBarHorizontalPointerDown } from '../src/parts/EditorCommand/EditorCommandHandleScrollBarHorizontalPointerDown.ts'
import { getScrollBarOffset, getScrollBarSize } from '../src/parts/ScrollBarFunctions/ScrollBarFunctions.ts'

jest.unstable_mockModule('../src/parts/Editor/Editor.ts', () => ({
  setDeltaY: async (state: any, deltaY: number) => ({ ...state, deltaY: state.deltaY + deltaY }),
  setDeltaYFixedValue: async (state: any, deltaY: number) => ({ ...state, deltaY }),
}))
const { setDelta } = await import('../src/parts/EditorCommand/EditorCommandSetDelta.ts')

const state: any = {
  deltaX: 0,
  deltaY: 0,
  finalDeltaY: 0,
  height: 100,
  itemHeight: 20,
  longestLineWidth: 10_000,
  minimumSliderSize: 24,
  numberOfVisibleLines: 5,
  width: 100,
  x: 50,
}

test('wheel offsets retain fractional pixels and clamp at both document edges', async () => {
  expect(await setDelta(state, 0, 0.5, 2)).toMatchObject({ deltaX: 0.5, deltaY: 2 })
  expect((await setDelta(state, 0, 100_000, 0)).deltaX).toBe(9900)
  expect((await setDelta(state, 0, -100, 0)).deltaX).toBe(0)
})

test('track clicks and thumb drags share the rendered minimum-size thumb and text extent', () => {
  const thumbWidth = getScrollBarSize(state.width, state.longestLineWidth, state.minimumSliderSize)
  expect(thumbWidth).toBe(24)
  const clicked = handleScrollBarHorizontalPointerDown(state, 100)
  expect(clicked.deltaX).toBe(4950)
  expect(getScrollBarOffset(clicked.deltaX, 9900, 100, thumbWidth)).toBe(38)
  const grabbed = handleScrollBarHorizontalPointerDown(clicked, 93)
  expect(grabbed.handleOffsetX).toBe(5)
  expect(handleScrollBarHorizontalMove(grabbed, 50 + 5 + 76).deltaX).toBe(9900)
  expect(handleScrollBarHorizontalMove(grabbed, 50 + 5).deltaX).toBe(0)
  expect(handleScrollBarHorizontalMove(grabbed, 50 + 5 + 0.5).deltaX).toBeCloseTo((9900 * 0.5) / 76)
})

test('nonoverflowing documents cannot scroll horizontally', async () => {
  const short = { ...state, handleOffsetX: 0, longestLineWidth: 80 }
  expect((await setDelta(short, 0, 1, 0)).deltaX).toBe(0)
  expect(handleScrollBarHorizontalMove(short, 1000).deltaX).toBe(0)
})

test('gutter width is excluded from both the wheel limit and scrollbar track', async () => {
  const withGutter = { ...state, gutterWidth: 30 }
  expect((await setDelta(withGutter, 0, 100_000, 0)).deltaX).toBe(9930)
  const clicked = handleScrollBarHorizontalPointerDown(withGutter, 80 + 35)
  expect(clicked.deltaX).toBe(4965)
})
