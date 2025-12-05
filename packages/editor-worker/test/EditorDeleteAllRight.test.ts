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

import * as EditorDeleteAllRight from '../src/parts/EditorCommand/EditorCommandDeleteAllRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorDeleteAllRight - at start', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1 2 3 4 5'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteAllRight.deleteAllRight(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorDeleteAllRight in middle', async () => {
  const cursor = {
    columnIndex: 5,
    rowIndex: 0,
  }
  const editor = {
    cursor,
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['1 2 3 4 5'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteAllRight.deleteAllRight(editor)).toMatchObject({
    lines: ['1 2 3'],
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
})
