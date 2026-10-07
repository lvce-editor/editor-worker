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
const rendererInvokeMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/FileSystemWorker/FileSystemWorker.ts', () => ({
  invoke: (method: string, ...args: any[]) =>
    method === 'FileSystem.readFile'
      ? readFileMock(...args)
      : rendererInvokeMock('Application.execute', args[0], 'FileSystem.readFile', ...args.slice(2)),
}))

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
    invoke: rendererInvokeMock,
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

test('loadContent does not focus the editor when focus is false and reading file fails', async () => {
  readFileMock.mockRejectedValue(new Error('Failed to read file'))

  const result = await LoadContent.loadContent(createState(), undefined, false, false)

  expect(result.loadError).toBe('Failed to read file')
  expect(result.focused).toBe(false)
})

test('loadContent shares a pending file read for the same application and uri', async () => {
  const { promise, resolve } = Promise.withResolvers<string>()
  readFileMock.mockReturnValue(promise)
  const firstLoad = LoadContent.loadContent(createState(), undefined)
  const secondLoad = LoadContent.loadContent({ ...createState(), id: 2 }, undefined)

  await new Promise((resolve) => setImmediate(resolve))
  expect(readFileMock).toHaveBeenCalledTimes(1)
  resolve('shared content')

  const [firstResult, secondResult] = await Promise.all([firstLoad, secondLoad])
  expect(firstResult.lines).toEqual(['shared content'])
  expect(secondResult.lines).toEqual(['shared content'])
})

test('loadContent keeps pending file reads separate across applications', async () => {
  rendererInvokeMock.mockImplementation(async (_method: string, applicationId: string) => `${applicationId} content`)
  const firstLoad = LoadContent.loadContent({ ...createState(), applicationId: 'first' }, undefined)
  const secondLoad = LoadContent.loadContent({ ...createState(), applicationId: 'second' }, undefined)

  const [firstResult, secondResult] = await Promise.all([firstLoad, secondLoad])

  expect(firstResult.lines).toEqual(['first content'])
  expect(secondResult.lines).toEqual(['second content'])
  expect(rendererInvokeMock).toHaveBeenCalledTimes(2)
})

test('loadContent removes failed pending reads so a later load retries', async () => {
  readFileMock.mockRejectedValueOnce(new Error('Failed to read file')).mockResolvedValueOnce('retried content')

  const firstResult = await LoadContent.loadContent(createState(), undefined)
  const secondResult = await LoadContent.loadContent({ ...createState(), id: 2 }, undefined)

  expect(firstResult.loadError).toBe('Failed to read file')
  expect(secondResult.lines).toEqual(['retried content'])
  expect(readFileMock).toHaveBeenCalledTimes(2)
})

test('loadContent forceReload bypasses a pending file read', async () => {
  const { promise, resolve } = Promise.withResolvers<string>()
  readFileMock.mockReturnValueOnce(promise).mockResolvedValueOnce('fresh content')
  const pendingLoad = LoadContent.loadContent(createState(), undefined)

  await new Promise((resolve) => setImmediate(resolve))
  const reloaded = await LoadContent.loadContent({ ...createState(), id: 2 }, undefined, false, true, true)

  expect(reloaded.lines).toEqual(['fresh content'])
  expect(readFileMock).toHaveBeenCalledTimes(2)
  resolve('stale content')
  expect((await pendingLoad).lines).toEqual(['stale content'])
})

test('loadContent reads again after a previous read completes', async () => {
  readFileMock.mockResolvedValueOnce('original content').mockResolvedValueOnce('changed externally')

  const firstResult = await LoadContent.loadContent(createState(), undefined)
  const secondResult = await LoadContent.loadContent({ ...createState(), id: 2 }, undefined)

  expect(firstResult.lines).toEqual(['original content'])
  expect(secondResult.lines).toEqual(['changed externally'])
  expect(readFileMock).toHaveBeenCalledTimes(2)
})

test('loads a separate document for the same uri in another application', async () => {
  const source = { ...createState(), applicationId: 'source', id: 2, initial: false, lines: ['unsaved source'], modified: true, uid: 2 }
  EditorStates.set(2, source, source)
  rendererInvokeMock.mockResolvedValue('preview file')
  const preview = { ...createState(), applicationId: 'preview' }

  const result = await LoadContent.loadContent(preview, undefined)

  expect(result.lines).toEqual(['preview file'])
  expect(result.modified).toBe(false)
  expect(result.applicationId).toBe('preview')
  expect(rendererInvokeMock).toHaveBeenCalledWith('Application.execute', 'preview', 'FileSystem.readFile', preview.uri)
  expect(EditorStates.get(2).newState.lines).toEqual(['unsaved source'])
})

test('reuses an unsaved document only within its application', async () => {
  const source = { ...createState(), applicationId: 'source', id: 2, initial: false, lines: ['unsaved source'], modified: true, uid: 2 }
  EditorStates.set(2, source, source)
  rendererInvokeMock.mockClear()

  const result = await LoadContent.loadContent({ ...createState(), applicationId: 'source' }, undefined)

  expect(result.lines).toEqual(['unsaved source'])
  expect(result.modified).toBe(true)
  expect(rendererInvokeMock).not.toHaveBeenCalled()
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

test('loadContent does not focus the editor when focus is false', async () => {
  readFileMock.mockResolvedValue('test')

  const result = await LoadContent.loadContent(createState(), undefined, false, false)

  expect(result.lines).toEqual(['test'])
  expect(result.focused).toBe(false)
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

test('loadContent restores a valid explicitly selected language mode', async () => {
  getLanguagesMock.mockResolvedValue([
    { extensions: ['.txt'], id: 'plaintext', tokenize: '' },
    { id: 'javascript', tokenize: '/test/tokenizeJavaScript.js' },
  ])
  readFileMock.mockResolvedValue('test')

  const result = await LoadContent.loadContent(createState(), { explicitLanguageId: 'javascript' })

  expect(result.languageId).toBe('javascript')
  expect(result.explicitLanguageId).toBe('javascript')
  expect(loadTokenizerMock).toHaveBeenCalledWith('javascript', '/test/tokenizeJavaScript.js')
})

test('loadContent ignores a saved language mode that is not registered', async () => {
  readFileMock.mockResolvedValue('test')

  const result = await LoadContent.loadContent(createState(), { explicitLanguageId: 'unknown' })

  expect(result.languageId).toBe('plaintext')
  expect(result.explicitLanguageId).toBeUndefined()
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

for (const formatOnSave of [true, false]) {
  test(`loads formatOnSave=${formatOnSave} into the editor state`, async () => {
    const preferences = await getEditorPreferencesMock()
    getEditorPreferencesMock.mockResolvedValue({ ...preferences, formatOnSave })
    readFileMock.mockResolvedValue('let x=1')
    const result = await LoadContent.loadContent(createState(), undefined)
    expect(result.formatOnSave).toBe(formatOnSave)
  })
}

test('confirmed large files disable automatic services and tokenizer loading', async () => {
  getEditorPreferencesMock.mockResolvedValue({
    breadcrumbsEnabled: true,
    diagnosticsEnabled: true,
    formatOnSave: true,
    hoverEnabled: true,
    isQuickSuggestionsEnabled: true,
    minimapEnabled: true,
    rowHeight: 20,
  })
  readFileMock.mockResolvedValue('https://example.com\nconst x = 1')
  const result = await LoadContent.loadContent(createState(), undefined, true)
  expect(result).toMatchObject({
    breadcrumbsEnabled: false,
    completionsOnType: false,
    decorations: [],
    diagnosticsEnabled: false,
    formatOnSave: false,
    hoverEnabled: false,
    isQuickSuggestionsEnabled: false,
    largeFile: true,
    minimapEnabled: false,
  })
  expect(loadTokenizerMock).not.toHaveBeenCalled()
  expect(extensionManagementWorkerInvoke).not.toHaveBeenCalled()
})

test('large files automatically disable services and tokenizer loading', async () => {
  getEditorPreferencesMock.mockResolvedValue({
    breadcrumbsEnabled: true,
    diagnosticsEnabled: true,
    formatOnSave: true,
    hoverEnabled: true,
    isQuickSuggestionsEnabled: true,
    minimapEnabled: true,
    rowHeight: 20,
  })
  readFileMock.mockResolvedValue('x'.repeat(10 * 1024 * 1024 + 1))
  const result = await LoadContent.loadContent(createState(), undefined)
  expect(result).toMatchObject({
    breadcrumbsEnabled: false,
    diagnosticsEnabled: false,
    formatOnSave: false,
    hoverEnabled: false,
    isQuickSuggestionsEnabled: false,
    largeFile: true,
    minimapEnabled: false,
  })
  expect(loadTokenizerMock).not.toHaveBeenCalled()
  expect(extensionManagementWorkerInvoke).not.toHaveBeenCalled()
})

test('large file mode survives restoring saved state', async () => {
  readFileMock.mockResolvedValue('text')
  const result = await LoadContent.loadContent(createState(), { largeFile: true })
  expect(result.largeFile).toBe(true)
  expect(loadTokenizerMock).not.toHaveBeenCalled()
})

test('split editors inherit large file mode and unsaved content', async () => {
  const source = { ...createState(), id: 2, initial: false, largeFile: true, lines: ['edited'], modified: true }
  EditorStates.set(2, source, source)
  const result = await LoadContent.loadContent(createState(), undefined)
  expect(result).toMatchObject({ largeFile: true, lines: ['edited'], modified: true })
  expect(readFileMock).not.toHaveBeenCalled()
  expect(loadTokenizerMock).not.toHaveBeenCalled()
})

test('closing while a file read is pending does not create document lines or request tokenization', async () => {
  const { promise, resolve } = Promise.withResolvers<string>()
  const started = Promise.withResolvers<void>()
  readFileMock.mockImplementation(() => {
    started.resolve()
    return promise
  })
  const state = { ...createState(), lifecycle: { disposed: false } }
  const pending = LoadContent.loadContent(state, undefined)
  await started.promise
  state.lifecycle.disposed = true
  resolve('large document contents')
  expect(await pending).toBe(state)
  expect(loadTokenizerMock).not.toHaveBeenCalled()
  expect(getVisibleMock).not.toHaveBeenCalled()
})
