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

import * as EditorDeleteWordRight from '../src/parts/EditorCommand/EditorCommandDeleteWordRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorDeleteWordRight', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['sample text'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 7, 0, 7),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteWordRight.deleteWordRight(editor)).toMatchObject({
    lines: ['sample '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test.skip('editorDeleteWordRight - when there is not word right', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['sample   '],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(0, 7, 0, 7),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteWordRight.deleteWordRight(editor)).toMatchObject({
    lines: ['sample  '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})
