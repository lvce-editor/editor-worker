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
    lines: ['sample text'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 11, 0, 11),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['sample '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test('editorDeleteWordLeft - merge lines', async () => {
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['1111122222'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})

test.skip('editorDeleteWordLeft - no word left', async () => {
  const editor = {
    lines: ['1   '],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
    lineCache: [],
    tokenizer: TokenizePlainText,
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteWordLeft - at start of line', async () => {
  const editor = {
    lines: ['1', '2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['12'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteWordLeft - at start of file', async () => {
  const editor = {
    lines: ['1', '2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: ['1', '2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteWordLeft - delete auto closing bracket', async () => {
  const editor = {
    lines: ['{}'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    undoStack: [],
    autoClosingRanges: [0, 1, 0, 1],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newState = await EditorDeleteWordLeft.deleteWordLeft(editor)
  expect(newState).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
