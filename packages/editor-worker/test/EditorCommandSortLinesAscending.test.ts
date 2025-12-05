import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async (method: string) => {
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)

import * as EditorCommandSortLinesAscending from '../src/parts/EditorCommand/EditorCommandSortLinesAscending.ts'

test('sortLinesAscending - two unsorted lines', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['b', 'a'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [],
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
