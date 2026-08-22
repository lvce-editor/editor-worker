import { expect, test } from '@jest/globals'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual - returns false when cursor infos change', () => {
  const oldState = {
    cursorInfos: [],
    diagnostics: [],
    differences: [],
    highlightedLine: -1,
    initial: false,
    lineNumbers: true,
    scrollBarHeight: 0,
    scrollBarWidth: 0,
    selectionInfos: [],
    textInfos: [],
  }

  const newState = {
    ...oldState,
    cursorInfos: ['10px 20px'],
  }

  expect(DiffItems.isEqual(oldState as any, newState as any)).toBe(false)
})

test('isEqual - returns false when selection infos change', () => {
  const oldState = {
    cursorInfos: ['10px 20px'],
    diagnostics: [],
    differences: [],
    highlightedLine: -1,
    initial: false,
    lineNumbers: true,
    scrollBarHeight: 0,
    scrollBarWidth: 0,
    selectionInfos: [],
    textInfos: [],
  }

  const newState = {
    ...oldState,
    selectionInfos: ['1px', '2px', '3px', '4px'],
  }

  expect(DiffItems.isEqual(oldState as any, newState as any)).toBe(false)
})

test('isEqual - returns false when end of line decorations change', () => {
  const oldState = {
    cursorInfos: [],
    diagnostics: [],
    differences: [],
    endOfLineDecorations: [],
    highlightedLine: -1,
    initial: false,
    lineNumbers: true,
    selectionInfos: [],
    textInfos: [],
  }

  const newState = {
    ...oldState,
    endOfLineDecorations: [{ rowIndex: 0, text: 'Test User • Initial commit' }],
  }

  expect(DiffItems.isEqual(oldState as any, newState as any)).toBe(false)
})

test('isEqual - returns false when gutter decorations change', () => {
  const oldState = {
    cursorInfos: [],
    diagnostics: [],
    differences: [],
    gutterDecorations: [],
    highlightedLine: -1,
    initial: false,
    lineNumbers: true,
    selectionInfos: [],
    textInfos: [],
  }

  const newState = {
    ...oldState,
    gutterDecorations: [{ rowIndex: 0, type: 'added' }],
  }

  expect(DiffItems.isEqual(oldState as any, newState as any)).toBe(false)
})
