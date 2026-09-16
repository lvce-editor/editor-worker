import { beforeEach, expect, jest, test } from '@jest/globals'

const getTokenizerMock = jest.fn()
const loadTokenizerMock = jest.fn()
const registerTokenizerMock = jest.fn()

jest.unstable_mockModule('../src/parts/Tokenizer/Tokenizer.ts', () => ({
  getTokenizer: getTokenizerMock,
  loadTokenizer: loadTokenizerMock,
}))

jest.unstable_mockModule('../src/parts/TokenizerMap/TokenizerMap.ts', () => ({
  register: registerTokenizerMock,
}))

const { setLanguageId } = await import('../src/parts/EditorCommand/EditorCommandSetLanguageId.ts')

beforeEach(() => {
  getTokenizerMock.mockReset()
  loadTokenizerMock.mockReset()
  registerTokenizerMock.mockReset()
})

test('setLanguageId loads the tokenizer and invalidates syntax highlighting', async () => {
  const editor = {
    focused: false,
    id: 1,
    invalidStartIndex: 4,
    languageId: 'plaintext',
    tokenizerId: 2,
    uid: 1,
  }
  const tokenizer = {
    tokenizeLine() {},
  }
  getTokenizerMock.mockReturnValue(tokenizer)
  registerTokenizerMock.mockReturnValue(17)

  const result = await setLanguageId(editor, 'xyz', '/extensions/test/tokenizeXyz.js')

  expect(loadTokenizerMock).toHaveBeenCalledWith('xyz', '/extensions/test/tokenizeXyz.js')
  expect(registerTokenizerMock).toHaveBeenCalledWith(tokenizer)
  expect(result).toEqual({
    ...editor,
    focused: true,
    invalidStartIndex: 0,
    languageId: 'xyz',
    tokenizerId: 17,
  })
})
