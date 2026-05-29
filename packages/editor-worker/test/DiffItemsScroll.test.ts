import { expect, test } from '@jest/globals'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual - returns false when deltaY changes', () => {
  const oldState = {
    cursorInfos: [],
    deltaY: 0,
    diagnostics: [],
    differences: [],
    highlightedLine: -1,
    initial: false,
    lineNumbers: true,
    scrollBarHeight: 20,
    scrollBarWidth: 0,
    selectionInfos: [],
    textInfos: [],
  }

  const newState = {
    ...oldState,
    deltaY: 40,
  }

  expect(DiffItems.isEqual(oldState as any, newState as any)).toBe(false)
})
