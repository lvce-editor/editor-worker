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
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['a'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [
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
  }
  const newEditor = await EditorCommandUndo.undo(editor)
  expect(newEditor.lines).toEqual([''])
})

test('undo - deleted character', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: [''],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [
      [
        {
          deleted: ['a'],
          end: {
            columnIndex: 0,
            rowIndex: 0,
          },
          inserted: [''],
          origin: EditOrigin.EditorType,
          start: {
            columnIndex: 0,
            rowIndex: 0,
          },
        },
      ],
    ],
  }
  const newEditor = await EditorCommandUndo.undo(editor)
  expect(newEditor.lines).toEqual(['a'])
})

test('undo - empty undoStack', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: [''],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [],
  }
  const newEditor = await EditorCommandUndo.undo(editor)
  expect(newEditor).toBe(editor)
})
