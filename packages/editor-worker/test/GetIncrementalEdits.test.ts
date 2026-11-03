import { beforeEach, expect, jest, test } from '@jest/globals'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import { emptyIncrementalEdits } from '../src/parts/EmptyIncrementalEdits/EmptyIncrementalEdits.ts'

const invoke = jest.fn<(...args: any[]) => Promise<any>>()
jest.unstable_mockModule('../src/parts/SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts', () => ({ invoke }))
const TokenizerState = await import('../src/parts/TokenizerState/TokenizerState.ts')
const { getIncrementalEdits } = await import('../src/parts/GetIncrementalEdits/GetIncrementalEdits.ts')

beforeEach(() => {
  invoke.mockReset()
  TokenizerState.setTokenizePath('plaintext', '')
})

const states = (oldLine: string, newLine: string): readonly [any, any] => [
  { lines: [oldLine], undoStack: [] },
  {
    deltaX: 0,
    languageId: 'javascript',
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
  expect(invoke).toHaveBeenCalledWith('TokenizeIncremental.tokenizeIncremental', 1, 'javascript', 'x', 'xx', 0, 0)
})

test('built-in plain text matches the incremental worker result without a request', async () => {
  const [oldState, newState] = states('x', 'xx')
  newState.languageId = 'plaintext'
  expect(await getIncrementalEdits(oldState, newState)).toEqual([{ columnIndex: 0, rowIndex: 0, text: 'xx' }])
  expect(invoke).not.toHaveBeenCalled()
})

test('contributed plaintext tokenizers keep incremental tokenization', async () => {
  TokenizerState.setTokenizePath('plaintext', '/custom.js')
  const [oldState, newState] = states('x', 'xx')
  newState.languageId = 'plaintext'
  const edits = [{ columnIndex: 0, rowIndex: 0, text: 'xx' }]
  invoke.mockResolvedValue(edits)
  expect(await getIncrementalEdits(oldState, newState)).toBe(edits)
  expect(invoke).toHaveBeenCalledWith('TokenizeIncremental.tokenizeIncremental', 1, 'plaintext', 'x', 'xx', 0, 0)
})

test('bundled plaintext also avoids incremental worker requests', async () => {
  TokenizerState.setTokenizePath('plaintext', '/assets/extensions/builtin.language-basics-plaintext/src/tokenizePlaintext.js')
  const [oldState, newState] = states('x', 'xx')
  newState.languageId = 'plaintext'
  newState.assetDir = '/assets'
  expect(await getIncrementalEdits(oldState, newState)).toEqual([{ columnIndex: 0, rowIndex: 0, text: 'xx' }])
  expect(invoke).not.toHaveBeenCalled()
})

test('local incremental tokens retain bidi, viewport and unchanged-length guards', async () => {
  for (const [oldLine, newLine, deltaX] of [
    ['א', 'אב', 0],
    ['x', 'xx', 1],
    ['x'.repeat(500), 'x'.repeat(501), 0],
    ['x', 'y', 0],
  ] as const) {
    const [oldState, newState] = states(oldLine, newLine)
    newState.languageId = 'plaintext'
    newState.deltaX = deltaX
    newState.rtl = true
    expect(await getIncrementalEdits(oldState, newState)).toBe(emptyIncrementalEdits)
  }
  expect(invoke).not.toHaveBeenCalled()
})

test('local incremental edit rows use viewport-relative indices', async () => {
  const [oldState, newState] = states('x', 'xx')
  newState.languageId = 'plaintext'
  oldState.lines = ['outside', 'x']
  newState.lines = ['outside', 'xx']
  newState.undoStack[0][0].start.rowIndex = 1
  newState.minLineY = 1
  expect(await getIncrementalEdits(oldState, newState)).toEqual([{ columnIndex: 0, rowIndex: 0, text: 'xx' }])
  expect(invoke).not.toHaveBeenCalled()
})
