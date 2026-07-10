import { expect, test } from '@jest/globals'
import * as DiffFocus from '../src/parts/DiffFocus/DiffFocus.ts'

test('isEqual - returns false when a focused editor starts selecting', () => {
  const oldState = {
    focus: 1,
    focused: true,
    isSelecting: false,
  }
  const newState = {
    ...oldState,
    isSelecting: true,
  }

  expect(DiffFocus.isEqual(oldState as any, newState as any)).toBe(false)
})

test('isEqual - returns true while selection continues', () => {
  const state = {
    focus: 1,
    focused: true,
    isSelecting: true,
  }

  expect(DiffFocus.isEqual(state as any, state as any)).toBe(true)
})

test('isEqual - returns true when the editor becomes unfocused', () => {
  const oldState = {
    focus: 1,
    focused: true,
    isSelecting: false,
  }
  const newState = {
    ...oldState,
    focused: false,
  }

  expect(DiffFocus.isEqual(oldState as any, newState as any)).toBe(true)
})
