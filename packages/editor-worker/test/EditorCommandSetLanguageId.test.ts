import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'

const extensionHostInvokeMock = jest.fn()
const getEditorMock = jest.fn()
const getTokenizerMock = jest.fn()
const loadTokenizerMock = jest.fn()
const setTokenizePathMock = jest.fn()
const setTokenizerMock = jest.fn()

jest.unstable_mockModule('../src/parts/ExtensionHostWorker/ExtensionHostWorker.ts', () => ({
  invoke: extensionHostInvokeMock,
}))

jest.unstable_mockModule('../src/parts/GetEditor/GetEditor.ts', () => ({
  getEditor: getEditorMock,
}))

jest.unstable_mockModule('../src/parts/Tokenizer/Tokenizer.ts', () => ({
  getTokenizer: getTokenizerMock,
  loadTokenizer: loadTokenizerMock,
}))

jest.unstable_mockModule('../src/parts/TokenizerMap/TokenizerMap.ts', () => ({
  set: setTokenizerMock,
}))

jest.unstable_mockModule('../src/parts/TokenizerState/TokenizerState.ts', () => ({
  setTokenizePath: setTokenizePathMock,
}))

const { setLanguageId } = await import('../src/parts/EditorCommand/EditorCommandSetLanguageId.ts')

beforeEach(() => {
  extensionHostInvokeMock.mockReset()
  getEditorMock.mockReset()
  getTokenizerMock.mockReset()
  loadTokenizerMock.mockReset()
  setTokenizePathMock.mockReset()
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
  }
  const latestEditor = {
    ...editor,
    focused: false,
  }
  const tokenizer = {
    tokenizeLine() {},
  }
  getEditorMock.mockReturnValue(latestEditor)
  getTokenizerMock.mockReturnValue(tokenizer)

  const result = await setLanguageId(editor, 'xyz', '/extensions/test/tokenizeXyz.js')

  expect(setTokenizePathMock).toHaveBeenCalledWith('xyz', '/extensions/test/tokenizeXyz.js')
  expect(loadTokenizerMock).toHaveBeenCalledWith('xyz', '/extensions/test/tokenizeXyz.js')
  expect(setTokenizerMock).toHaveBeenCalledWith(3, tokenizer)
  expect(extensionHostInvokeMock).toHaveBeenCalledWith(ExtensionHostCommandType.TextDocumentSetLanguageId, 1, 'xyz')
  expect(result).toEqual({
    ...latestEditor,
    focused: true,
    invalidStartIndex: 0,
    languageId: 'xyz',
    tokenizerId: 3,
  })
})
