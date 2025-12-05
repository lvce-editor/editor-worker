import { expect, jest, test } from '@jest/globals'
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

const HandleTab = await import('../src/parts/HandleTab/HandleTab.ts')
const TabCompletion = await import('../src/parts/TabCompletion/TabCompletion.ts')

test.skip('handleTab - no result', async () => {
  // Skipped: Cannot spy on ES module exports (read-only properties)
  const getTabCompletionSpy = jest.spyOn(TabCompletion, 'getTabCompletion').mockResolvedValue(undefined)
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['a'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    undoStack: [],
  }
  const newEditor = await HandleTab.handleTab(editor)
  // TODO two spaces should be inserted
  expect(newEditor).toBe(editor)
  getTabCompletionSpy.mockRestore()
})

test.skip('handleTab - apply result', async () => {
  // Skipped: Cannot spy on ES module exports (read-only properties)
  const getTabCompletionSpy = jest.spyOn(TabCompletion, 'getTabCompletion').mockResolvedValue({
    deleted: 6,
    inserted: '<button>$0</button>',
    type: 2,
  })
  const editor = {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines: ['button'],
    minLineY: 0,
    numberOfVisibleLines: 32,
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    undoStack: [],
  }
  const newEditor = await HandleTab.handleTab(editor)
  // TODO
  expect(newEditor.lines).toEqual(['<button></button>button'])
  getTabCompletionSpy.mockRestore()
})
