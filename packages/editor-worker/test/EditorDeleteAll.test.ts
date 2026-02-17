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

import * as EditorDeleteAll from '../src/parts/EditorCommand/EditorCommandDeleteAll.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('deleteAll', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: EditorSelection.fromRange(1, 3, 1, 3),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorDeleteAll.deleteAll(editor)).toMatchObject({
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
