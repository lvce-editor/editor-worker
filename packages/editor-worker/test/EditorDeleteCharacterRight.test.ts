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

import * as EditorDeleteCharacterRight from '../src/parts/EditorCommand/EditorCommandDeleteCharacterRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('deleteCharacterRight', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['a'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('deleteCharacterRight - with selection', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    undoStack: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['lne 2'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('deleteCharacterRight - empty line', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['', 'next line'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['next line'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('deleteCharacterRight - merge lines', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
    undoStack: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['line 1line 2'],
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('deleteCharacterRight - emoji - 👮🏽‍♀️', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['👮🏽‍♀️'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('deleteCharacterRight - multiple words', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['sample text'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    undoStack: [],
  }
  expect(await EditorDeleteCharacterRight.deleteCharacterRight(editor)).toMatchObject({
    lines: ['sampl text'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})
