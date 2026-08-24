import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const extensionManagementWorkerInvoke = jest.fn()
const extensionHostInvoke = jest.fn()
const getEditorPreferencesMock: any = jest.fn()
const getLanguagesMock: any = jest.fn()
const getVisibleMock: any = jest.fn()
const getTokenizerMock: any = jest.fn()
const loadTokenizerMock: any = jest.fn()
const measureCharacterWidthMock: any = jest.fn()
const readFileMock: any = jest.fn()

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  ExtensionHost: {
    invoke: extensionHostInvoke,
    invokeAndTransfer: jest.fn(),
    set: jest.fn(),
  },
  ExtensionManagementWorker: {
    invoke: extensionManagementWorkerInvoke,
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

jest.unstable_mockModule('../src/parts/EditorText/EditorText.ts', () => ({
  getVisible: getVisibleMock,
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
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')

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
    hoverEnabled: true,
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
  extensionHostInvoke.mockReset()
  extensionManagementWorkerInvoke.mockReset()
  getEditorPreferencesMock.mockReset()
  getLanguagesMock.mockReset()
  getVisibleMock.mockReset()
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
    highlightActiveLineNumber: false,
    hoverEnabled: true,
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
  getVisibleMock.mockResolvedValue({ differences: [], textInfos: [] })
  getTokenizerMock.mockReturnValue({})
  measureCharacterWidthMock.mockResolvedValue(8)
})

afterEach(() => {
  EditorStates.dispose(2)
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

test('loadContent returns loaded text without requesting diagnostics', async () => {
  getEditorPreferencesMock.mockResolvedValue({
    completionTriggerCharacters: [],
    diagnosticsEnabled: true,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    highlightActiveLineNumber: false,
    hoverEnabled: true,
    isAutoClosingBracketsEnabled: false,
    isAutoClosingQuotesEnabled: false,
    isAutoClosingTagsEnabled: false,
    isQuickSuggestionsEnabled: false,
    letterSpacing: 0,
    lineNumbers: true,
    rowHeight: 20,
    tabSize: 2,
  })
  readFileMock.mockResolvedValue('test')

  const result = await LoadContent.loadContent(createState(), undefined)

  expect(result.lines).toEqual(['test'])
  expect(result.highlightActiveLineNumber).toBe(false)
  expect(result.hoverEnabled).toBe(true)
  expect(extensionHostInvoke).not.toHaveBeenCalled()
  expect(extensionManagementWorkerInvoke).not.toHaveBeenCalled()
})

test('loadContent uses a tokenizer from a later contribution for the same language', async () => {
  getLanguagesMock.mockResolvedValue([
    { extensions: ['.txt'], id: 'plaintext' },
    { id: 'plaintext', tokenize: '/test/tokenizePlainText.js' },
  ])
  readFileMock.mockResolvedValue('test')

  await LoadContent.loadContent(createState(), undefined)

  expect(loadTokenizerMock).toHaveBeenCalledWith('plaintext', '/test/tokenizePlainText.js')
})

test('loadContent reuses unsaved content from another editor for the same uri', async () => {
  const existingEditor = {
    ...createState(),
    id: 2,
    initial: false,
    lines: ['unsaved content'],
    modified: true,
    redoStack: ['redo'],
    uid: 2,
    undoStack: ['undo'],
  }
  EditorStates.set(2, existingEditor, existingEditor)

  const result = await LoadContent.loadContent(createState(), undefined)

  expect(result.lines).toEqual(['unsaved content'])
  expect(result.modified).toBe(true)
  expect(result.redoStack).toBe(existingEditor.redoStack)
  expect(result.undoStack).toBe(existingEditor.undoStack)
  expect(readFileMock).not.toHaveBeenCalled()
})

test('loadContent restores saved history when the file content is unchanged', async () => {
  readFileMock.mockResolvedValue('saved content')
  const redoStack = [['redo']]
  const undoStack = [['undo']]

  const result = await LoadContent.loadContent(createState(), {
    lines: ['saved content'],
    redoStack,
    undoStack,
  })

  expect(result.redoStack).toBe(redoStack)
  expect(result.undoStack).toBe(undoStack)
})

test('loadContent discards saved history when the file content changed', async () => {
  readFileMock.mockResolvedValue('changed externally')

  const result = await LoadContent.loadContent(createState(), {
    lines: ['saved content'],
    redoStack: [['redo']],
    undoStack: [['undo']],
  })

  expect(result.redoStack).toEqual([])
  expect(result.undoStack).toEqual([])
})

test('loadContent ignores malformed saved history', async () => {
  readFileMock.mockResolvedValue('saved content')

  const result = await LoadContent.loadContent(createState(), {
    lines: ['saved content'],
    redoStack: {},
    undoStack: [['undo']],
  })

  expect(result.redoStack).toEqual([])
  expect(result.undoStack).toEqual([])
})
