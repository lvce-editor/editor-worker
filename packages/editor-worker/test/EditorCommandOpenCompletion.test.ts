import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>(async () => [])
jest.unstable_mockModule('../src/parts/CompletionWorker/CompletionWorker.ts', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/Id/Id.ts', () => ({ create: () => 99 }))
const { emptyEditor } = await import('../src/parts/EmptyEditor/EmptyEditor.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const { openCompletion } = await import('../src/parts/EditorCommand/EditorCommandOpenCompletion.ts')

test('opens completion with the owning editor application', async () => {
  const editor = { ...emptyEditor, applicationId: 'preview', languageId: 'plaintext', uid: 42, widgets: [] }
  EditorStates.set(42, editor, editor)
  await openCompletion(editor)
  expect(invoke).toHaveBeenNthCalledWith(1, 'Completions.create', 99, 0, 0, 0, 0, 42, 'plaintext', 'preview')
})

test('preserves an absent application id for global completion providers', async () => {
  invoke.mockClear()
  const editor = { ...emptyEditor, languageId: 'plaintext', uid: 43, widgets: [] }
  EditorStates.set(43, editor, editor)
  await openCompletion(editor)
  expect(invoke).toHaveBeenNthCalledWith(1, 'Completions.create', 99, 0, 0, 0, 0, 43, 'plaintext', undefined)
})

test('disposes completion state when the editor changes while results are pending', async () => {
  const { promise: loadContent, resolve: resolveLoadContent } = Promise.withResolvers<void>()
  invoke.mockClear()
  invoke.mockImplementation(async (command: unknown) => {
    if (command === 'Completions.loadContent') {
      await loadContent
    }
    return []
  })
  const editor = { ...emptyEditor, applicationId: 'preview', languageId: 'plaintext', uid: 44, widgets: [] }
  EditorStates.set(44, editor, editor)
  const pending = openCompletion(editor)

  const updatedEditor = { ...editor, selections: new Uint32Array([0, 1]) }
  EditorStates.set(44, editor, updatedEditor)
  resolveLoadContent()
  await pending

  expect(invoke).toHaveBeenCalledWith('Completions.dispose', 99)
})

test('disposes completion state when loading its content fails', async () => {
  invoke.mockClear()
  invoke.mockImplementation(async (command: unknown) => {
    if (command === 'Completions.loadContent') {
      throw new Error('provider failed')
    }
    return []
  })
  const editor = { ...emptyEditor, languageId: 'plaintext', uid: 45, widgets: [] }
  EditorStates.set(45, editor, editor)

  await expect(openCompletion(editor)).rejects.toThrow('provider failed')

  expect(invoke).toHaveBeenCalledWith('Completions.dispose', 99)
})

test('automatic empty results never attach or render a widget', async () => {
  invoke.mockClear()
  invoke.mockImplementation(async (command: unknown) => (command === 'Completions.hasItems' ? false : []))
  const editor = { ...emptyEditor, languageId: 'typescript', uid: 46, widgets: [] }
  EditorStates.set(46, editor, editor)
  const result = await openCompletion(editor, true)
  expect(result.widgets).toEqual([])
  expect(invoke).toHaveBeenCalledWith('Completions.loadContent', 99, true)
  expect(invoke).toHaveBeenCalledWith('Completions.dispose', 99)
  expect(invoke).not.toHaveBeenCalledWith('Completions.render2', expect.anything(), expect.anything())
})

test('automatic nonempty results retain automatic intent and editor focus', async () => {
  invoke.mockClear()
  invoke.mockImplementation(async (command: unknown) => (command === 'Completions.hasItems' ? true : []))
  const editor = { ...emptyEditor, languageId: 'typescript', uid: 47, widgets: [] }
  EditorStates.set(47, editor, editor)
  const result = await openCompletion(editor, true)
  expect(result.widgets).toHaveLength(1)
  expect(result.widgets[0].newState.automatic).toBe(true)
  expect(result.focused).toBe(true)
})

test('automatic refresh removes an existing widget when results become empty', async () => {
  invoke.mockClear()
  invoke.mockImplementation(async (command: unknown) => (command === 'Completions.hasItems' ? false : []))
  const editor = { ...emptyEditor, languageId: 'typescript', uid: 48, widgets: [] }
  EditorStates.set(48, editor, editor)
  invoke.mockImplementation(async (command: unknown) => (command === 'Completions.hasItems' ? true : []))
  const opened = await openCompletion(editor, true)
  EditorStates.set(48, editor, opened)
  invoke.mockClear()
  invoke.mockImplementation(async (command: unknown) => (command === 'Completions.hasItems' ? false : []))
  const result = await openCompletion(opened, true)
  expect(result.widgets).toEqual([])
  expect(result.focused).toBe(true)
  expect(invoke).not.toHaveBeenCalledWith('Completions.create', expect.anything())
})

test('explicit request converts an automatic widget to explicit empty feedback', async () => {
  invoke.mockClear()
  invoke.mockImplementation(async (command: unknown) => (command === 'Completions.hasItems' ? true : []))
  const editor = { ...emptyEditor, languageId: 'typescript', uid: 49, widgets: [] }
  EditorStates.set(49, editor, editor)
  const opened = await openCompletion(editor, true)
  EditorStates.set(49, editor, opened)
  invoke.mockClear()
  invoke.mockImplementation(async () => [])
  const result = await openCompletion(opened)
  expect(result.widgets).toHaveLength(1)
  expect(result.widgets[0].newState.automatic).toBe(false)
  expect(invoke).toHaveBeenCalledWith('Completions.loadContent', 99, false)
  expect(invoke).not.toHaveBeenCalledWith('Completions.hasItems', 99)
})
