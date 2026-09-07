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
