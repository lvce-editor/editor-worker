import { expect, test } from '@jest/globals'
import { toggleBreakpoint } from '../src/parts/EditorCommand/EditorCommandToggleBreakpoint.ts'

test('adds a breakpoint on the primary cursor row', () => {
  const editor = {
    breakPoints: [],
    selections: new Uint32Array([2, 4, 2, 4]),
  }

  expect(toggleBreakpoint(editor as any).breakPoints).toEqual([2])
})

test('removes an existing breakpoint on the primary cursor row', () => {
  const editor = {
    breakPoints: [0, 2],
    selections: new Uint32Array([2, 4, 2, 4]),
  }

  expect(toggleBreakpoint(editor as any).breakPoints).toEqual([0])
})

test('preserves existing breakpoints when adding another', () => {
  const editor = {
    breakPoints: [3],
    selections: new Uint32Array([1, 0, 1, 0]),
  }

  expect(toggleBreakpoint(editor as any).breakPoints).toEqual([3, 1])
})
