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
