import { expect, jest, test } from '@jest/globals'

const getTokensViewport2 = jest.fn<(...args: any[]) => Promise<any>>()
const loadTokenizers = jest.fn<(...args: any[]) => Promise<void>>()

jest.unstable_mockModule('../src/parts/GetTokensViewport2/GetTokensViewport2.ts', () => ({
  getTokensViewport2,
}))

jest.unstable_mockModule('../src/parts/LoadTokenizers/LoadTokenizers.ts', () => ({
  loadTokenizers,
}))

jest.unstable_mockModule('../src/parts/TokenMaps/TokenMaps.ts', () => ({
  get: () => ({
    1: 'Keyword',
    2: 'Whitespace',
  }),
}))

const GetMinimapLines = await import('../src/parts/GetMinimapLines/GetMinimapLines.ts')

test('requests syntax highlighting for the full document', async () => {
  getTokensViewport2.mockResolvedValue({
    embeddedResults: [],
    tokenizersToLoad: [],
    tokens: [{ tokens: [1, 5, 2, 1, 1, 4] }, { tokens: [1, 6] }, { tokens: [2, 2, 1, 5] }],
  })
  const editor = {
    languageId: 'javascript',
    lines: ['const test', 'return', '  value'],
  }

  await expect(GetMinimapLines.getMinimapLines(editor, true)).resolves.toEqual([
    [5, 'Token Keyword', 1, 'Token Whitespace', 4, 'Token Keyword'],
    [6, 'Token Keyword'],
    [2, 'Token Whitespace', 5, 'Token Keyword'],
  ])
  expect(getTokensViewport2).toHaveBeenCalledWith(editor, 0, 3, true)
  expect(loadTokenizers).not.toHaveBeenCalled()
})

test('uses full-line embedded syntax highlighting', async () => {
  getTokensViewport2.mockResolvedValue({
    embeddedResults: [
      {
        isFull: true,
        result: { tokens: [3, 5] },
        TokenMap: { 3: 'String' },
      },
    ],
    tokenizersToLoad: [],
    tokens: [{ embeddedResultIndex: 0, tokens: [1, 5] }],
  })
  const editor = {
    languageId: 'html',
    lines: ['value'],
  }

  await expect(GetMinimapLines.getMinimapLines(editor, true)).resolves.toEqual([[5, 'Token String']])
})
