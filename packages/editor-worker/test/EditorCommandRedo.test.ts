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

import * as EditorCommandRedo from '../src/parts/EditorCommand/EditorCommandRedo.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'

test('redo - inserted character', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: [''],
    minLineY: 0,
    numberOfVisibleLines: 32,
    redoStack: [
      [
        {
          deleted: [''],
          end: {
            columnIndex: 0,
            rowIndex: 0,
          },
          inserted: ['a'],
          origin: EditOrigin.EditorType,
          start: {
            columnIndex: 0,
            rowIndex: 0,
          },
        },
      ],
    ],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [],
  }
  const newEditor = await EditorCommandRedo.redo(editor)
  expect(newEditor.lines).toEqual(['a'])
  expect(newEditor.redoStack).toEqual([])
  expect(newEditor.undoStack).toEqual(editor.redoStack)
})

test('redo - empty redoStack', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: [''],
    minLineY: 0,
    numberOfVisibleLines: 32,
    redoStack: [],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [],
  }
  const newEditor = await EditorCommandRedo.redo(editor)
  expect(newEditor).toBe(editor)
})
