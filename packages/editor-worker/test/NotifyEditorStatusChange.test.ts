import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/NotifyListeners/NotifyListeners.ts', () => ({
  notifyListeners: jest.fn(),
}))

const { notifyEditorStatusChange } = await import('../src/parts/NotifyEditorStatusChange/NotifyEditorStatusChange.ts')
const NotifyListeners = await import('../src/parts/NotifyListeners/NotifyListeners.ts')

const createEditor = (overrides: Record<string, unknown> = {}) =>
  ({
    focused: true,
    initial: false,
    languageId: 'plaintext',
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize: 4,
    ...overrides,
  }) as any

test('notifies editor status listeners when the cursor changes', async () => {
  const oldEditor = createEditor()
  const newEditor = createEditor({ selections: new Uint32Array([0, 0, 2, 5]) })

  await notifyEditorStatusChange(oldEditor, newEditor)

  expect(NotifyListeners.notifyListeners).toHaveBeenCalledWith(2, 'StatusBar.handleEditorStatusChanged', {
    column: 6,
    encoding: 'utf8',
    languageId: 'plaintext',
    line: 3,
    tabSize: 4,
  })
})

test('notifies after an editor becomes active even when its status values did not change', async () => {
  const oldEditor = createEditor({ focused: false })
  const newEditor = createEditor()

  await notifyEditorStatusChange(oldEditor, newEditor)

  expect(NotifyListeners.notifyListeners).toHaveBeenCalledWith(2, 'StatusBar.handleEditorStatusChanged', expect.any(Object))
})

test('does not notify for unchanged or inactive editor status', async () => {
  const editor = createEditor()
  jest.mocked(NotifyListeners.notifyListeners).mockClear()

  await notifyEditorStatusChange(editor, editor)
  await notifyEditorStatusChange(editor, createEditor({ focused: false, selections: new Uint32Array([0, 0, 1, 1]) }))

  expect(NotifyListeners.notifyListeners).not.toHaveBeenCalled()
})
