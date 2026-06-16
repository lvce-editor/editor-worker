import { expect, test } from '@jest/globals'
import * as DiffCss from '../src/parts/DiffCss/DiffCss.ts'

const state = {
  deltaY: 0,
  finalDeltaY: 80,
  height: 40,
  rowHeight: 20,
  scrollBarHeight: 24,
}

test('isEqual - returns true when css variables are unchanged', () => {
  expect(DiffCss.isEqual(state as any, state as any)).toBe(true)
})

test('isEqual - returns false when row height changes', () => {
  expect(DiffCss.isEqual(state as any, { ...state, rowHeight: 24 } as any)).toBe(false)
})

test('isEqual - returns false when scrollbar top changes', () => {
  expect(DiffCss.isEqual(state as any, { ...state, deltaY: 40 } as any)).toBe(false)
})

test('isEqual - returns false when scrollbar height changes', () => {
  expect(DiffCss.isEqual(state as any, { ...state, scrollBarHeight: 20 } as any)).toBe(false)
})
