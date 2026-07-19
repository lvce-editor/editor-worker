import { beforeEach, expect, jest, test } from '@jest/globals'

const getTokenizerMock = jest.fn()
const loadTokenizerMock = jest.fn()
const setStoredLanguageModeMock = jest.fn()
const setTokenizerMock = jest.fn()

jest.unstable_mockModule('../src/parts/LanguageModeStorage/LanguageModeStorage.ts', () => ({
  set: setStoredLanguageModeMock,
}))

jest.unstable_mockModule('../src/parts/Tokenizer/Tokenizer.ts', () => ({
  getTokenizer: getTokenizerMock,
  loadTokenizer: loadTokenizerMock,
}))

jest.unstable_mockModule('../src/parts/TokenizerMap/TokenizerMap.ts', () => ({
  set: setTokenizerMock,
}))

const { setLanguageId } = await import('../src/parts/EditorCommand/EditorCommandSetLanguageId.ts')

beforeEach(() => {
  getTokenizerMock.mockReset()
  loadTokenizerMock.mockReset()
  setStoredLanguageModeMock.mockReset()
  setTokenizerMock.mockReset()
})

test('setLanguageId loads the tokenizer and invalidates syntax highlighting', async () => {
  const editor = {
    focused: false,
    id: 1,
    invalidStartIndex: 4,
    languageId: 'plaintext',
    tokenizerId: 2,
    uid: 1,
    uri: 'file:///test.txt',
  }
  const tokenizer = {
    tokenizeLine() {},
  }
  getTokenizerMock.mockReturnValue(tokenizer)

  const result = await setLanguageId(editor, 'xyz', '/extensions/test/tokenizeXyz.js')

  expect(loadTokenizerMock).toHaveBeenCalledWith('xyz', '/extensions/test/tokenizeXyz.js')
  expect(setTokenizerMock).toHaveBeenCalledWith(3, tokenizer)
  expect(setStoredLanguageModeMock).toHaveBeenCalledWith('file:///test.txt', 'xyz')
  expect(result).toEqual({
    ...editor,
    focused: true,
    invalidStartIndex: 0,
    languageId: 'xyz',
    tokenizerId: 3,
  })
})
