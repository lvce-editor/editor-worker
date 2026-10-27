import { beforeEach, expect, jest, test } from '@jest/globals'

const storage = new Map<string, ArrayBuffer>()
const getCacheStorageItem = jest.fn(async (key: string) => (storage.has(key) ? { body: storage.get(key)! } : null))
const setCacheStorageItem = jest.fn(async (key: string, body: ArrayBuffer) => {
  storage.set(key, body)
  return { success: true }
})
const removeCacheStorageItem = jest.fn(async (key: string) => storage.delete(key))
const invoke = jest.fn<(...args: any[]) => Promise<any>>()
const fingerprint = jest.fn(async () => 'implementation-v1')

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  CacheWorker: { getCacheStorageItem, removeCacheStorageItem, setCacheStorageItem },
  SyntaxHighlightingWorker: { invoke },
}))
jest.unstable_mockModule('../src/parts/TokenizerFingerprint/TokenizerFingerprint.ts', () => ({ getFingerprint: fingerprint }))
const { getTokensViewport2 } = await import('../src/parts/GetTokensViewport2/GetTokensViewport2.ts')
const TokenizerMap = await import('../src/parts/TokenizerMap/TokenizerMap.ts')
const TokenizerState = await import('../src/parts/TokenizerState/TokenizerState.ts')
const SyntaxHighlightingState = await import('../src/parts/SyntaxHighlightingState/SyntaxHighlightingState.ts')

const tokenizeLine = jest.fn((line: string, previous: any) => ({
  state: { comment: line.includes('/*') || (previous.state.comment && !line.includes('*/')) },
  tokens: [previous.state.comment ? 60 : 1, line.length],
}))
const tokenizerId = TokenizerMap.register({ hasArrayReturn: true, initialLineState: { state: { comment: false } }, tokenizeLine })
const createEditor = (overrides: any = {}) => ({
  assetDir: '/build-a',
  id: 1,
  invalidStartIndex: 0,
  languageId: 'test',
  lifecycle: { disposed: false },
  lineCache: [],
  lines: ['/*', 'comment', '*/', 'code'],
  syntaxHighlightingCacheEnabled: true,
  tokenizerId,
  ...overrides,
})

beforeEach(() => {
  storage.clear()
  jest.clearAllMocks()
  SyntaxHighlightingState.setEnabled(false)
  TokenizerState.setTokenizePath('test', '/test.js')
})

test('disabled mode performs no storage reads, writes or fingerprint work', async () => {
  await getTokensViewport2(createEditor({ syntaxHighlightingCacheEnabled: false }), 0, 2, false)
  expect(getCacheStorageItem).not.toHaveBeenCalled()
  expect(setCacheStorageItem).not.toHaveBeenCalled()
  expect(fingerprint).not.toHaveBeenCalled()
})

test('a new editor reuses persisted tokens and reconstructs continuation state on a later scroll or edit', async () => {
  const cold = await getTokensViewport2(createEditor(), 0, 2, false)
  expect(tokenizeLine).toHaveBeenCalledTimes(2)
  const reopened = createEditor()
  expect(await getTokensViewport2(reopened, 0, 2, false)).toEqual({
    ...cold,
    tokens: cold.tokens.map(({ tokens }: any) => ({ tokens })),
  })
  expect(tokenizeLine).toHaveBeenCalledTimes(2)
  const scrolled = await getTokensViewport2(reopened, 2, 4, false)
  expect(scrolled.tokens[0].tokens[0]).toBe(60)
  expect(tokenizeLine).toHaveBeenCalledTimes(6)
  const edited = createEditor({ lines: ['ordinary', 'changed', '*/', 'code'] })
  expect((await getTokensViewport2(edited, 0, 2, false)).tokens[1].tokens[0]).toBe(1)
  expect(tokenizeLine).toHaveBeenCalledTimes(8)
})

test('content, language, engine build and tokenizer graph changes miss the cache', async () => {
  await getTokensViewport2(createEditor(), 0, 2, false)
  for (const change of [{ lines: ['changed', 'comment'] }, { languageId: 'other' }, { assetDir: '/build-b' }]) {
    TokenizerState.setTokenizePath('other', '/other.js')
    tokenizeLine.mockClear()
    await getTokensViewport2(createEditor(change), 0, 2, false)
    expect(tokenizeLine).toHaveBeenCalledTimes(2)
  }
  TokenizerState.setTokenizePath('helper', '/new-helper.js')
  fingerprint.mockResolvedValueOnce('implementation-v2')
  tokenizeLine.mockClear()
  await getTokensViewport2(createEditor(), 0, 2, false)
  expect(tokenizeLine).toHaveBeenCalledTimes(2)
})

test('unavailable storage and corrupt entries fall back to tokenization', async () => {
  getCacheStorageItem.mockRejectedValueOnce(new Error('Storage disabled'))
  await expect(getTokensViewport2(createEditor(), 0, 2, false)).resolves.toHaveProperty('tokens')
  const key = storage.keys().next().value!
  storage.set(key, new ArrayBuffer(16))
  tokenizeLine.mockClear()
  await getTokensViewport2(createEditor(), 0, 2, false)
  expect(tokenizeLine).toHaveBeenCalledTimes(2)
  expect(removeCacheStorageItem).toHaveBeenCalled()
})

test('a worker cache hit does not claim lines were sent; a miss sends all lines to rebuild worker state', async () => {
  SyntaxHighlightingState.setEnabled(true)
  const response = { embeddedResults: [], tokenizersToLoad: [], tokens: [{ tokens: [1, 2] }] }
  invoke.mockResolvedValue(response)
  await getTokensViewport2(createEditor(), 0, 1, true)
  const reopened = createEditor()
  await getTokensViewport2(reopened, 0, 1, true)
  expect(invoke).toHaveBeenCalledTimes(1)
  await getTokensViewport2(reopened, 1, 2, true)
  expect(invoke).toHaveBeenCalledTimes(2)
  expect(invoke.mock.calls[1][4]).toBe(true)
  expect(invoke.mock.calls[1][6]).toEqual(reopened.lines)
})

test('disposal while a cache read is pending prevents further highlighting and writes', async () => {
  const editor = createEditor()
  getCacheStorageItem.mockImplementationOnce(async () => {
    editor.lifecycle.disposed = true
    return null
  })
  expect(await getTokensViewport2(editor, 0, 2, false)).toEqual({ embeddedResults: [], tokenizersToLoad: [], tokens: [] })
  expect(tokenizeLine).not.toHaveBeenCalled()
  expect(setCacheStorageItem).not.toHaveBeenCalled()
})
