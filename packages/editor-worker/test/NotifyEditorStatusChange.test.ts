import { afterEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import * as EditorListeners from '../src/parts/EditorListeners/EditorListeners.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { notifyEditorStatusChange, notifyEditorStatusCleared } from '../src/parts/NotifyEditorStatusChange/NotifyEditorStatusChange.ts'
import { registerListener } from '../src/parts/RegisterListener/RegisterListener.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'
import { unregisterListener } from '../src/parts/UnregisterListener/UnregisterListener.ts'

const createEditor = (overrides: Record<string, unknown> = {}) =>
  ({
    endOfLine: 'lf',
    focused: true,
    initial: false,
    insertSpaces: true,
    languageId: 'plaintext',
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize: 4,
    uid: 900,
    ...overrides,
  }) as any

const setup = () => {
  const changed = jest.fn<(update: unknown) => Promise<void>>().mockResolvedValue(undefined)
  const rpc = createMockRpc({
    commandMap: {
      'StatusBar.handleEditorStatusChanged': changed,
      'StatusBar.supportsEditorStatusDeltas': () => true,
    },
  })
  RpcRegistry.set(900, rpc)
  return changed
}

afterEach(() => {
  EditorListeners.clearAll()
  EditorStates.dispose(900)
})

test('registration initializes status from the active editor and cursor changes send deltas', async () => {
  const changed = setup()
  const editor = createEditor()
  EditorStates.set(900, editor, editor)
  await registerListener(2, 900)
  expect(changed).toHaveBeenCalledWith({
    column: 1,
    encoding: 'utf8',
    endOfLine: 'lf',
    insertSpaces: true,
    languageId: 'plaintext',
    line: 1,
    tabSize: 4,
  })
  await notifyEditorStatusChange(editor, createEditor({ selections: new Uint32Array([0, 0, 2, 5]) }))
  expect(changed).toHaveBeenLastCalledWith({ column: 6, line: 3 })
})

test('equal-value tab switches and inactive editors do not replace status', async () => {
  const changed = setup()
  const editor = createEditor()
  EditorStates.set(900, editor, editor)
  await registerListener(2, 900)
  changed.mockClear()
  await notifyEditorStatusChange(createEditor({ focused: false }), editor)
  await notifyEditorStatusChange(editor, createEditor({ focused: false, selections: new Uint32Array([0, 0, 1, 1]) }))
  expect(changed).not.toHaveBeenCalled()
})

test('unregister discards the baseline and registration sends a full status again', async () => {
  const changed = setup()
  const editor = createEditor()
  EditorStates.set(900, editor, editor)
  await registerListener(2, 900)
  unregisterListener(2, 900)
  await registerListener(2, 900)
  expect(changed).toHaveBeenCalledTimes(2)
  expect(changed.mock.calls[1]).toEqual(changed.mock.calls[0])
  await notifyEditorStatusCleared()
  expect(changed).toHaveBeenLastCalledWith(undefined)
})
