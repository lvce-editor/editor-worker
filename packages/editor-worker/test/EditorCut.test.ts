import { beforeEach, expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async (method: string) => {
    if (method === 'ClipBoard.writeText') {
      throw new Error('not implemented')
    }
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)

beforeEach(() => {
  // Reset is handled by MockRpc
})

const EditorCut = await import('../src/parts/EditorCommand/EditorCommandCut.ts')
const EditorSelection = await import('../src/parts/EditorSelection/EditorSelection.ts')

test.skip('editorCut', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 2, 2),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorCut.cut(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 1, 2, 2),
    lines: ['line 1', 'lne 3', ''],
  })

  //   expect(Command.execute).toHaveBeenCalledTimes(1)
  //   expect(Command.execute).toHaveBeenCalledWith(
  //     'ClipBoard.writeText',
  //     `ine 2
  // li`,
  //   )
})

// TODO handle error gracefully
test.skip('editorCut - error with clipboard', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    throw new Error('Writing to clipboard not allowed')
  })
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    selections: EditorSelection.fromRange(1, 1, 2, 2),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  await expect(EditorCut.cut(editor)).rejects.toThrow(new Error('Writing to clipboard not allowed'))
})

test.skip('editorCut - no selection', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 1, 1),
    lineCache: [],
  }
  expect(await EditorCut.cut(editor)).toMatchObject({
    selections: EditorSelection.fromRange(1, 1, 1, 1),
    lines: ['line 1', 'line 2', 'line 3', ''],
  })
  // expect(Command.execute).not.toHaveBeenCalled()
})
