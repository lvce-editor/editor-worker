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

import * as EditorCopyLineUp from '../src/parts/EditorCommand/EditorCommandCopyLineUp.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

test('editorCopyLineUp', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['line 1', 'line 2', 'line 3'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: new Uint32Array([2, 0, 2, 0]),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  const newEditor = await EditorCopyLineUp.copyLineUp(editor)
  expect(newEditor.lines).toEqual(['line 1', 'line 2', 'line 3', 'line 3'])
  expect(newEditor.selections).toEqual(new Uint32Array([3, 0, 3, 0]))
})
