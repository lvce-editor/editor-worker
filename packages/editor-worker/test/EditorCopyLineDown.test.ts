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
    lines: ['line 1', 'line 2', 'line 3'],
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
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCopyLineDown - cursor in middle of line', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  expect(await EditorCopyLineDown.copyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})
