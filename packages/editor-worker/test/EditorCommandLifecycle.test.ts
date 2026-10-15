import { afterEach, expect, jest, test } from '@jest/globals'
const measureCharacterWidth = jest.fn<() => Promise<number>>()

jest.unstable_mockModule('../src/parts/MeasureCharacterWidth/MeasureCharacterWidth.ts', () => ({ measureCharacterWidth }))
jest.unstable_mockModule('../src/parts/GetEditorPreferences/GetEditorPreferences.ts', () => ({
  getEditorPreferences: async () => ({
    breadcrumbsEnabled: false,
    diagnosticsEnabled: false,
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 400,
    hoverEnabled: true,
    letterSpacing: 0,
    minimapEnabled: false,
    rowHeight: 20,
  }),
}))
jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({ get: async () => false }))

const { createStandaloneEditor } = await import('../src/parts/CreateStandaloneEditor/CreateStandaloneEditor.ts')
const { disposeEditor } = await import('../src/parts/DisposeEditor/DisposeEditor.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const { handleSettingsChanged } = await import('../src/parts/HandleSettingsChanged/HandleSettingsChanged.ts')
const { render2 } = await import('../src/parts/Render2/Render2.ts')
const RenderedDoms = await import('../src/parts/RenderedDoms/RenderedDoms.ts')
const { wrapCommand } = await import('../src/parts/WrapRpcCommands/WrapRpcCommands.ts')

const uid = 906

afterEach(() => {
  EditorStates.dispose(uid)
  RenderedDoms.clear()
})

test('does not resurrect an editor disposed during an asynchronous settings layout update', async () => {
  await createStandaloneEditor({
    assetDir: '/assets',
    charWidth: 9,
    content: 'other file',
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 400,
    height: 600,
    id: uid,
    languageId: 'plaintext',
    letterSpacing: 0,
    lineNumbers: false,
    platform: 2,
    rowHeight: 20,
    tabSize: 2,
    tokenizePath: '',
    uri: 'memfs:///other.txt',
    width: 800,
    x: 0,
    y: 0,
  })
  render2(uid, [])
  const started = Promise.withResolvers<void>()
  const resume = Promise.withResolvers<void>()
  measureCharacterWidth.mockImplementation(async () => {
    started.resolve()
    await resume.promise
    return 9
  })
  const updateSettings = wrapCommand(handleSettingsChanged)
  const updating = updateSettings(uid)
  await started.promise
  await disposeEditor(uid)
  resume.resolve()
  await updating

  expect(() => render2(uid, [])).not.toThrow()
  expect(EditorStates.get(uid)).toBeUndefined()
  expect(RenderedDoms.get(uid)).toBeUndefined()
})
