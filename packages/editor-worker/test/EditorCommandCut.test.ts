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
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['a'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: [0, 0, 0, 0],
    undoStack: [],
  }
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual([''])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 0]))
})

test('cut - selection', async () => {
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['a'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    selections: [0, 0, 0, 1],
    undoStack: [],
  }
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual([''])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 1]))
})
