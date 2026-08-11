import { expect, test } from '@jest/globals'
import * as EditorSelectUp from '../src/parts/EditorCommand/EditorCommandSelectUp.ts'

const selectUp = (selections: number[]) => {
  const editor = {
    lineCache: [],
    lines: ['111', '22', '3333', '4', '555'],
    selections: new Uint32Array(selections),
  }
  return EditorSelectUp.selectUp(editor).selections
}

test.each([
  ['starts a selection above the cursor', [2, 1, 2, 1], [2, 1, 1, 1]],
  ['expands a selection whose cursor is at the top', [3, 1, 1, 1], [3, 1, 0, 1]],
  ['shrinks a selection whose cursor is at the bottom', [1, 1, 3, 1], [1, 1, 2, 1]],
  ['collapses a selection at its anchor', [1, 1, 2, 1], [1, 1, 1, 1]],
  ['crosses the anchor and reverses the selection', [1, 1, 1, 1], [1, 1, 0, 1]],
  ['stops at the first line', [3, 1, 0, 1], [3, 1, 0, 1]],
  ['preserves both columns', [1, 2, 3, 3], [1, 2, 2, 3]],
  ['updates every cursor independently', [1, 0, 3, 0, 4, 2, 2, 2], [1, 0, 2, 0, 4, 2, 1, 2]],
])('%s', (name, selections, expected) => {
  expect(selectUp(selections)).toEqual(new Uint32Array(expected))
})

test('does not mutate the existing selections', () => {
  const selections = new Uint32Array([1, 0, 3, 0])
  const editor = {
    lineCache: [],
    lines: ['1', '2', '3', '4'],
    selections,
  }
  EditorSelectUp.selectUp(editor)
  expect(selections).toEqual(new Uint32Array([1, 0, 3, 0]))
})
