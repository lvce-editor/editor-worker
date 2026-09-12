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

import * as EditorCopyLineDown from '../src/parts/EditorCommand/EditorCommandCopyLineDown.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorCopyLineDown - cursor at start of line', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCopyLineDown - cursor in middle of line', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 3, 1, 3),
  })
})

test('editorCopyLineDown - multiple cursors', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 6, 0, 6, 1, 6, 1, 6]),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 2', 'line 3'],
    selections: new Uint32Array([1, 6, 1, 6, 3, 6, 3, 6]),
  })
})

test.each([0, 2])('editorCopyLineDown - cursor at end of row %i', async (row) => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(row, 6, row, 6),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  const lines = [...editor.lines]
  lines.splice(row, 0, lines[row])
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines,
    selections: EditorSelection.fromRange(row + 1, 6, row + 1, 6),
  })
})
test('editorCopyLineDown - multiple cursors on the same line', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 2, 0, 2, 0, 6, 0, 6]),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: new Uint32Array([1, 2, 1, 2, 1, 6, 1, 6]),
  })
})
