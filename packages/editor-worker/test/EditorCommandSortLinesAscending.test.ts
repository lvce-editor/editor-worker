import { expect, test } from '@jest/globals'
import * as EditorCommandSortLinesAscending from '../src/parts/EditorCommand/EditorCommandSortLinesAscending.ts'

test('sortLinesAscending - two unsorted lines', async () => {
  const editor = {
    lines: ['b', 'a'],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [],
    lineCache: [],
  }
  const newEditor = await EditorCommandSortLinesAscending.sortLinesAscending(editor)
  expect(newEditor.lines).toEqual(['a', 'b'])
})

// TODO
test.skip('sortLinesAscending - with underscores - https://github.com/microsoft/vscode/issues/48123', async () => {
  const editor = {
    lines: ['a_b.txt', 'a_b_c.txt'],
    selections: new Uint32Array([0, 0, 1, 9]),
    undoStack: [],
  }
  const newEditor = await EditorCommandSortLinesAscending.sortLinesAscending(editor)
  expect(newEditor.lines).toEqual(['a_b.txt', 'a_b_c.txt'])
})
