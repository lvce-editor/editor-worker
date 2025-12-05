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

import * as EditorDeleteWordLeft from '../src/parts/EditorCommand/EditorCommandDeleteWordLeft.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorDeleteWordLeft', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['sample text'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 11, 0, 11),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['sample '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test('editorDeleteWordLeft - merge lines', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['11111', '22222'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['1111122222'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test.skip('editorDeleteWordLeft - no word left', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1   '],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
    tokenizer: TokenizePlainText,
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteWordLeft - at start of line', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1', '2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['12'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteWordLeft - at start of file', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1', '2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['1', '2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteWordLeft - delete auto closing bracket', async () => {
  const editor = {
    autoClosingRanges: [0, 1, 0, 1],
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['{}'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    undoStack: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
