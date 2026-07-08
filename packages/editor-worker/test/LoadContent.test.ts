import { beforeEach, expect, jest, test } from '@jest/globals'

const getEditorPreferencesMock: any = jest.fn()
const getLanguagesMock: any = jest.fn()
const getTokenizerMock: any = jest.fn()
const loadTokenizerMock: any = jest.fn()
const measureCharacterWidthMock: any = jest.fn()
const readFileMock: any = jest.fn()

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  ExtensionHost: {
    invoke: jest.fn(),
    invokeAndTransfer: jest.fn(),
    set: jest.fn(),
  },
  ExtensionManagementWorker: {
    invoke: jest.fn(),
  },
  RendererWorker: {
    getPreference: jest.fn(),
    invoke: jest.fn(),
    readFile: readFileMock,
  },
  SyntaxHighlightingWorker: {
    invoke: jest.fn(),
    invokeAndTransfer: jest.fn(),
    set: jest.fn(),
  },
  TextMeasurementWorker: {
    invoke: jest.fn(),
    invokeAndTransfer: jest.fn(),
    set: jest.fn(),
  },
}))

jest.unstable_mockModule('../src/parts/GetEditorPreferences/GetEditorPreferences.ts', () => ({
  getEditorPreferences: getEditorPreferencesMock,
}))

jest.unstable_mockModule('../src/parts/GetLanguages/GetLanguages.ts', () => ({
  getLanguages: getLanguagesMock,
}))

jest.unstable_mockModule('../src/parts/MeasureCharacterWidth/MeasureCharacterWidth.ts', () => ({
  measureCharacterWidth: measureCharacterWidthMock,
}))

jest.unstable_mockModule('../src/parts/Tokenizer/Tokenizer.ts', () => ({
  getTokenizer: getTokenizerMock,
  loadTokenizer: loadTokenizerMock,
}))

const LoadContent = await import('../src/parts/LoadContent/LoadContent.ts')

const createState = () =>
  ({
    assetDir: '/test/assets',
    charWidth: 8,
    columnWidth: 0,
    completionTriggerCharacters: [],
    cursorWidth: 2,
    deltaY: 0,
    differences: [],
    embeds: [],
    focused: false,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    height: 200,
    highlightedLine: -1,
    id: 1,
    initial: true,
    isMonospaceFont: false,
    itemHeight: 20,
    languageId: '',
    letterSpacing: 0,
    lineNumbers: true,
    lines: [],
    maxLineY: 0,
    minimumSliderSize: 20,
    minLineY: 0,
    numberOfVisibleLines: 0,
    platform: 1,
    rowHeight: 20,
    selections: new Uint32Array(),
    tabSize: 2,
    textInfos: [],
    tokenizerId: 0,
    uid: 1,
    uri: 'file:///test.txt',
    width: 300,
    x: 0,
    y: 0,
  }) as any

beforeEach(() => {
  getEditorPreferencesMock.mockReset()
  getLanguagesMock.mockReset()
  getTokenizerMock.mockReset()
  loadTokenizerMock.mockReset()
  measureCharacterWidthMock.mockReset()
  readFileMock.mockReset()

  getEditorPreferencesMock.mockResolvedValue({
    completionTriggerCharacters: [],
    diagnosticsEnabled: false,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    isAutoClosingBracketsEnabled: false,
    isAutoClosingQuotesEnabled: false,
    isAutoClosingTagsEnabled: false,
    isQuickSuggestionsEnabled: false,
    letterSpacing: 0,
    lineNumbers: true,
    rowHeight: 20,
    tabSize: 2,
  })
  getLanguagesMock.mockResolvedValue([{ extensions: ['.txt'], id: 'plaintext', tokenize: '' }])
  getTokenizerMock.mockReturnValue({})
  measureCharacterWidthMock.mockResolvedValue(8)
})

test('loadContent returns error state when reading file fails', async () => {
  readFileMock.mockRejectedValue(new Error('Failed to read file'))

  const result = await LoadContent.loadContent(createState(), undefined)

  expect(result.loadError).toBe('Failed to read file')
  expect(result.focused).toBe(true)
  expect(result.initial).toBe(false)
  expect(result.textInfos).toEqual([])
  expect(result.height).toBe(200)
  expect(readFileMock).toHaveBeenCalledWith('file:///test.txt')
})
