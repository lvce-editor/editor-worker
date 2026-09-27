import { expect, jest, test } from '@jest/globals'

const execute = jest.fn<(...args: readonly any[]) => Promise<any>>()

jest.unstable_mockModule('../src/parts/ExtensionManagementEditor/ExtensionManagementEditor.ts', () => ({
  execute,
}))

const { getDocumentSymbols } = await import('../src/parts/GetDocumentSymbols/GetDocumentSymbols.ts')

test('requests document symbols from extension management', async () => {
  const editor = { languageId: 'typescript', lines: ['const value = 1'], uri: '/test.ts' }
  const symbols = [{ endOffset: 5, kind: 12, name: 'value', selectionEndOffset: 5, selectionStartOffset: 0, startOffset: 0 }]
  execute.mockResolvedValue(symbols)

  await expect(getDocumentSymbols(editor)).resolves.toBe(symbols)
  expect(execute).toHaveBeenCalledWith({
    args: [],
    editor,
    kind: 'document symbol',
    method: 'provideDocumentSymbols',
    noProviderFoundResult: [],
  })
})

test('returns an empty array for invalid provider results', async () => {
  execute.mockResolvedValue({ name: 'not-an-array' })
  await expect(getDocumentSymbols({})).resolves.toEqual([])
})

test('returns an empty array when a provider fails', async () => {
  execute.mockRejectedValue(new Error('provider failed'))
  await expect(getDocumentSymbols({})).resolves.toEqual([])
})
