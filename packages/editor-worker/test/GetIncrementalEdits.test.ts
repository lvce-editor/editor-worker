import { beforeEach, expect, jest, test } from '@jest/globals'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import { emptyIncrementalEdits } from '../src/parts/EmptyIncrementalEdits/EmptyIncrementalEdits.ts'

const invoke = jest.fn<(...args: any[]) => Promise<any>>()
jest.unstable_mockModule('../src/parts/SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts', () => ({ invoke }))
const { getIncrementalEdits } = await import('../src/parts/GetIncrementalEdits/GetIncrementalEdits.ts')

beforeEach(() => {
  invoke.mockReset()
})

const states = (oldLine: string, newLine: string): readonly [any, any] => [
  { lines: [oldLine], undoStack: [] },
  {
    deltaX: 0,
    languageId: 'plaintext',
    lines: [newLine],
    minLineY: 0,
    uid: 1,
    undoStack: [[{ origin: EditOrigin.EditorType, start: { rowIndex: 0 } }]],
  },
]

test('first character on an empty line uses full rendering without an incremental token RPC', async () => {
  invoke.mockRejectedValue(new Error('incremental tokenization should not be requested'))
  expect(await getIncrementalEdits(...states('', 'x'))).toBe(emptyIncrementalEdits)
  expect(invoke).not.toHaveBeenCalled()
})

test('nonempty line keeps incremental token updates', async () => {
  const edits = [{ columnIndex: 0, rowIndex: 0, text: 'xx' }]
  invoke.mockResolvedValue(edits)
  expect(await getIncrementalEdits(...states('x', 'xx'))).toBe(edits)
  expect(invoke).toHaveBeenCalledWith('TokenizeIncremental.tokenizeIncremental', 1, 'plaintext', 'x', 'xx', 0, 0)
})
