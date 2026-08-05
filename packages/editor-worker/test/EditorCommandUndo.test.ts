import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async (method: string) => {
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)
SyntaxHighlightingWorker.set(
  MockRpc.create({
    commandMap: {},
    invoke: async () => [{}],
  }),
)

import * as Editor from '../src/parts/Editor/Editor.ts'
import * as EditorCommandUndo from '../src/parts/EditorCommand/EditorCommandUndo.ts'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'

const createChange = (text: string, columnIndex: number) => ({
  deleted: [''],
  end: { columnIndex, rowIndex: 0 },
  inserted: [text],
  origin: EditOrigin.EditorType,
  start: { columnIndex, rowIndex: 0 },
})

test('undo - inserted character', async () => {
  const editor = {
    ...emptyEditor,
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

test('undo - contiguous typing group', async () => {
  const editor = {
    ...emptyEditor,
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['abc'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: new Uint32Array([0, 3, 0, 3]),
    undoStack: [
      [
        {
          deleted: [''],
          end: {
            columnIndex: 0,
            rowIndex: 0,
          },
          inserted: ['abc'],
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

test('schedule document edits - coalesces contiguous typing', async () => {
  let editor = {
    ...emptyEditor,
    invalidStartIndex: 0,
    lines: [''],
    modified: false,
    selections: new Uint32Array([0, 0, 0, 0]),
    uid: 1,
    uri: 'file:///test.txt',
  }

  editor = await Editor.scheduleDocumentAndCursorsSelections(editor, [createChange('a', 0)])
  editor = await Editor.scheduleDocumentAndCursorsSelections(editor, [createChange('b', 1)])

  expect(editor.undoStack).toEqual([[{ ...createChange('a', 0), inserted: ['ab'] }]])
})

test('undo - deleted character', async () => {
  const editor = {
    ...emptyEditor,
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
    ...emptyEditor,
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
