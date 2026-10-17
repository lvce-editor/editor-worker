import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: any[]) => Promise<any>>()
jest.unstable_mockModule('../src/parts/SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts', () => ({ invoke }))
const { createEditor2 } = await import('../src/parts/CreateEditor2/CreateEditor2.ts')
const { disposeEditor } = await import('../src/parts/DisposeEditor/DisposeEditor.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const SyntaxHighlightingState = await import('../src/parts/SyntaxHighlightingState/SyntaxHighlightingState.ts')
const { getTokensViewport2 } = await import('../src/parts/GetTokensViewport2/GetTokensViewport2.ts')

beforeEach(() => {
  invoke.mockReset()
  invoke.mockResolvedValue({ embeddedResults: [], tokenizersToLoad: [], tokens: [] })
  SyntaxHighlightingState.setEnabled(true)
})

const create = (id: number) => {
  createEditor2(id, 'memfs:///large.ts', 0, 0, 100, 100, 1, '')
  return { ...EditorStates.get(id).newState, languageId: 'plaintext', lines: ['large file'] }
}

test('closing releases sent lines and syntax document while another editor remains usable', async () => {
  const first = create(8101)
  const second = { ...create(8102), lines: first.lines }
  await getTokensViewport2(first, 0, 1, true)
  await getTokensViewport2(second, 0, 1, true)
  await getTokensViewport2(first, 0, 1, true)
  expect(invoke.mock.calls.at(-1)?.[4]).toBe(false)

  await disposeEditor(first.id)
  expect(first.lifecycle?.sentLines).toBeUndefined()
  expect(invoke).toHaveBeenCalledWith('TextDocument.dispose', first.id)
  expect(EditorStates.get(first.id)).toBeUndefined()
  expect(second.lifecycle?.sentLines).toBe(second.lines)

  invoke.mockClear()
  await getTokensViewport2(first, 0, 1, true)
  expect(invoke).not.toHaveBeenCalled()
  await getTokensViewport2(second, 0, 1, true)
  expect(invoke).toHaveBeenCalledTimes(1)
  await disposeEditor(second.id)
})

test('a late tokenization continuation cannot recreate a closed document', async () => {
  const editor = create(8103)
  const { promise, resolve } = Promise.withResolvers<any>()
  invoke.mockImplementationOnce(() => promise)
  const pending = getTokensViewport2(editor, 0, 1, true)
  await disposeEditor(editor.id)
  resolve({ embeddedResults: [], tokenizersToLoad: [], tokens: [] })
  await pending
  invoke.mockClear()
  await getTokensViewport2({ ...editor }, 0, 1, true)
  expect(invoke).not.toHaveBeenCalled()
  expect(editor.lifecycle?.sentLines).toBeUndefined()
})
