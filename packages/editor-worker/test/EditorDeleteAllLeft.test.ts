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

import * as EditorDeleteAllLeft from '../src/parts/EditorCommand/EditorCommandDeleteAllLeft.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorDeleteAllLeft', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1 2 3 4 5'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 9, 0, 9),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteAllLeft in middle', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1 2 3 4 5'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: [' 4 5'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorDeleteAllLeft - with selection', () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    tokenizer: TokenizePlainText,
  }
  expect(EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    line: ['lne 2'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteAllLeft - at start of line', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1', '2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: ['12'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorDeleteAllLeft - at start of file', async () => {
  const cursor = {
    columnIndex: 0,
    rowIndex: 0,
  }
  const editor = {
    cursor,
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1', '2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteAllLeft.deleteAllLeft(editor)).toMatchObject({
    lines: ['1', '2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
