import { expect, test } from '@jest/globals'
import * as EditorSelectDown from '../src/parts/EditorCommand/EditorCommandSelectDown.ts'

const selectDown = (selections: number[]) => {
  const editor = {
    lineCache: [],
    lines: ['111', '22', '3333', '4', '555'],
    selections: new Uint32Array(selections),
  }
  return EditorSelectDown.selectDown(editor).selections
}

test.each([
  ['starts a selection below the cursor', [2, 1, 2, 1], [2, 1, 3, 1]],
  ['expands a selection whose cursor is at the bottom', [1, 1, 3, 1], [1, 1, 4, 1]],
  ['shrinks a selection whose cursor is at the top', [3, 1, 1, 1], [3, 1, 2, 1]],
  ['collapses a selection at its anchor', [3, 1, 2, 1], [3, 1, 3, 1]],
  ['crosses the anchor and reverses the selection', [3, 1, 3, 1], [3, 1, 4, 1]],
  ['stops at the last line', [1, 1, 4, 1], [1, 1, 4, 1]],
  ['preserves both columns', [3, 2, 1, 3], [3, 2, 2, 3]],
  ['updates every cursor independently', [3, 0, 1, 0, 0, 2, 2, 2], [3, 0, 2, 0, 0, 2, 3, 2]],
])('%s', (name, selections, expected) => {
  expect(selectDown(selections)).toEqual(new Uint32Array(expected))
})

test('does not mutate the existing selections', () => {
  const selections = new Uint32Array([3, 0, 1, 0])
  const editor = {
    lineCache: [],
    lines: ['1', '2', '3', '4'],
    selections,
  }
  EditorSelectDown.selectDown(editor)
  expect(selections).toEqual(new Uint32Array([3, 0, 1, 0]))
})
