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

import * as EditorCommandUndo from '../src/parts/EditorCommand/EditorCommandUndo.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'

test('undo - inserted character', async () => {
  const editor = {
    lines: ['a'],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 0,
          },
          inserted: ['a'],
          deleted: [''],
          origin: EditOrigin.EditorType,
        },
      ],
    ],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newEditor = await EditorCommandUndo.undo(editor)
  expect(newEditor.lines).toEqual([''])
})

test('undo - deleted character', async () => {
  const editor = {
    lines: [''],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 0,
          },
          inserted: [''],
          deleted: ['a'],
          origin: EditOrigin.EditorType,
        },
      ],
    ],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newEditor = await EditorCommandUndo.undo(editor)
  expect(newEditor.lines).toEqual(['a'])
})

test('undo - empty undoStack', async () => {
  const editor = {
    lines: [''],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newEditor = await EditorCommandUndo.undo(editor)
  expect(newEditor).toBe(editor)
})
