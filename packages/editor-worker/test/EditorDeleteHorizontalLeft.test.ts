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

import * as EditorDeleteHorizontalLeft from '../src/parts/EditorCommand/EditorCommandDeleteHorizontalLeft.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorDeleteCharacterHorizontalLeft - single character - no selection', async () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    undoStack: [],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  expect(await EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, () => 1)).toMatchObject({
    lines: ['ine 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteCharacterHorizontalLeft - multiple selections', async () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4]),
    undoStack: [],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  expect(await EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, () => 1)).toMatchObject({
    lines: [' 1', ' 2'],
    selections: EditorSelection.fromRanges([0, 0, 0, 0], [1, 0, 1, 0]),
  })
})

// TODO test merging multiple lines with multiple cursors/selections
