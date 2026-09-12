import { beforeEach, expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'

const state: {
  writeTextSpy?: jest.Mock
} = {}

const mockRpc = MockRpc.create({
  commandMap: {},
  invoke: async (method: string, ...args: any[]) => {
    if (method === 'ClipBoard.writeText') {
      return state.writeTextSpy?.(...args)
    }
    return undefined
  },
})
ExtensionHost.set(mockRpc)
RendererWorker.set(mockRpc)

const EditorCommandCut = await import('../src/parts/EditorCommand/EditorCommandCut.ts')
const EditorSelection = await import('../src/parts/EditorSelection/EditorSelection.ts')

beforeEach(() => {
  state.writeTextSpy = jest.fn()
})

const createEditor = (lines: string[], selections: Uint32Array | number[]) => {
  return {
    decorations: [],
    invalidStartIndex: 0,
    lineCache: [],
    lines,
    minLineY: 0,
    modified: true,
    numberOfVisibleLines: 32,
    selections,
    undoStack: [],
  }
}

test('cut - empty selection cuts line and collapses to line start', async () => {
  const editor = createEditor(['a'], [0, 0, 0, 0])

  const newEditor = await EditorCommandCut.cut(editor)

  expect(newEditor.lines).toEqual([''])
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 0, 0, 0))
  expect(state.writeTextSpy).toHaveBeenCalledWith('a')
})

test('cut - selection collapses to selection start', async () => {
  const editor = createEditor(['alpha beta'], EditorSelection.fromRange(0, 6, 0, 10))

  const newEditor = await EditorCommandCut.cut(editor)

  expect(newEditor.lines).toEqual(['alpha '])
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 6, 0, 6))
  expect(state.writeTextSpy).toHaveBeenCalledWith('beta')
})

test('cut - multiple selections collapse independently', async () => {
  const editor = createEditor(['one alpha', 'two beta', 'three gamma'], EditorSelection.fromRanges([0, 4, 0, 9], [1, 4, 1, 8]))

  const newEditor = await EditorCommandCut.cut(editor)

  expect(newEditor.lines).toEqual(['one ', 'two ', 'three gamma'])
  expect(newEditor.selections).toEqual(EditorSelection.fromRanges([0, 4, 0, 4], [1, 4, 1, 4]))
  expect(state.writeTextSpy).toHaveBeenCalledWith('alpha\nbeta')
})

test('cut - reversed selection collapses to normalized start', async () => {
  const editor = createEditor(['alpha beta'], EditorSelection.fromRange(0, 10, 0, 6))

  const newEditor = await EditorCommandCut.cut(editor)

  expect(newEditor.lines).toEqual(['alpha '])
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 6, 0, 6))
  expect(state.writeTextSpy).toHaveBeenCalledWith('beta')
})

test('cut - multiple cursors cut multiple lines and collapse to line starts', async () => {
  const editor = createEditor(['one', 'two', 'three'], EditorSelection.fromRanges([0, 2, 0, 2], [2, 1, 2, 1]))

  const newEditor = await EditorCommandCut.cut(editor)

  expect(newEditor.lines).toEqual(['', 'two', ''])
  expect(newEditor.selections).toEqual(EditorSelection.fromRanges([0, 0, 0, 0], [2, 0, 2, 0]))
  expect(state.writeTextSpy).toHaveBeenCalledWith('one\nthree')
})

test('cut - mixed cursor and selection uses selected text mode', async () => {
  const editor = createEditor(['cursor', 'alpha beta'], EditorSelection.fromRanges([0, 3, 0, 3], [1, 6, 1, 10]))

  const newEditor = await EditorCommandCut.cut(editor)

  expect(newEditor.lines).toEqual(['cursor', 'alpha '])
  expect(newEditor.selections).toEqual(EditorSelection.fromRanges([0, 3, 0, 3], [1, 6, 1, 6]))
  expect(state.writeTextSpy).toHaveBeenCalledWith('beta')
})

test.each([
  { cursor: 0, expected: ['alpha'], lines: ['', 'alpha'], row: 0 },
  { cursor: 1, expected: ['alpha', 'beta'], lines: ['alpha', '', 'beta'], row: 1 },
  { cursor: 0, expected: ['alpha'], lines: ['alpha', ''], row: 1 },
  { cursor: 0, expected: [''], lines: [''], row: 0 },
])('cut - empty row in $lines', async ({ cursor, expected, lines, row }) => {
  const editor = createEditor(lines, EditorSelection.fromRange(row, 0, row, 0))
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual(expected)
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(cursor, 0, cursor, 0))
})

test.each([
  { cursors: [0, 0], expected: ['alpha'], lines: ['', '', 'alpha'], rows: [0, 1] },
  { cursors: [0, 0], expected: ['alpha'], lines: ['alpha', '', ''], rows: [1, 2] },
  { cursors: [0, 0, 0], expected: [''], lines: ['', '', ''], rows: [0, 1, 2] },
  { cursors: [0, 1, 1], expected: ['alpha', ''], lines: ['', 'alpha', '', 'beta'], rows: [0, 2, 3] },
  { cursors: [0, 0, 0], expected: [''], lines: ['alpha', '', ''], rows: [0, 1, 2] },
  { cursors: [0, 0], expected: [''], lines: ['alpha', ''], rows: [0, 1] },
])('cut - multiple cursors including empty rows in $lines', async ({ cursors, expected, lines, rows }) => {
  const editor = createEditor(lines, new Uint32Array(rows.flatMap((row) => [row, 0, row, 0])))
  const newEditor = await EditorCommandCut.cut(editor)
  expect(newEditor.lines).toEqual(expected)
  expect(newEditor.selections).toEqual(new Uint32Array(cursors.flatMap((row) => [row, 0, row, 0])))
})
