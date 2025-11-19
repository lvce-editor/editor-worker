import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async (method: string) => {
    if (method === 'ClipBoard.writeText') {
      return undefined
    }
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)

const EditorCommandCut = await import('../src/parts/EditorCommand/EditorCommandCut.ts')

test('cut - empty selection', async () => {
  const editor = {
    selections: [0, 0, 0, 0],
    lines: ['a'],
    undoStack: [],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual([''])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 0]))
})

test('cut - selection', async () => {
  const editor = {
    selections: [0, 0, 0, 1],
    lines: ['a'],
    undoStack: [],
    lineCache: [],
    invalidStartIndex: 0,
    minLineY: 0,
    numberOfVisibleLines: 32,
    decorations: [],
  }
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual([''])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 1]))
})
