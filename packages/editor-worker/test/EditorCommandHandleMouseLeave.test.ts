import { afterEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorHoverDismissalState from '../src/parts/EditorHoverDismissalState/EditorHoverDismissalState.ts'
import * as Editors from '../src/parts/EditorStates/EditorStates.ts'

const EditorCommandHandleMouseLeave = await import('../src/parts/EditorCommand/EditorCommandHandleMouseLeave.ts')

const editor = {
  uid: 99,
  widgets: [{ id: WidgetId.Hover, newState: { uid: 100 } }],
}

afterEach(() => {
  jest.useRealTimers()
  EditorHoverDismissalState.clear(editor.uid)
  Editors.dispose(editor.uid)
})

test('handleMouseLeave - dismisses the current hover after a short delay', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  using _mockRpc = RendererWorker.registerMockRpc({ 'Editor.renderPending': jest.fn() })

  EditorCommandHandleMouseLeave.handleMouseLeave(editor.uid, false)
  await jest.advanceTimersByTimeAsync(499)
  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(1)

  await jest.advanceTimersByTimeAsync(1)
  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(0)
})

test('handleMouseLeave - an editor re-entry cancels the pending dismissal', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  EditorCommandHandleMouseLeave.handleMouseLeave(editor.uid, false)
  EditorCommandHandleMouseLeave.handleMouseEnter(editor.uid)

  await jest.advanceTimersByTimeAsync(500)

  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(1)
})

test('handleMouseLeave - ignores mouse movement within the editor', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  EditorCommandHandleMouseLeave.handleMouseLeave(editor.uid, true)

  await jest.advanceTimersByTimeAsync(500)

  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(1)
})

test('handleMouseLeave - does not remove a replacement hover', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  using _mockRpc = RendererWorker.registerMockRpc({ 'Editor.renderPending': jest.fn() })
  EditorCommandHandleMouseLeave.handleMouseLeave(editor.uid, false)
  const replacement = {
    ...editor,
    widgets: [{ id: WidgetId.Hover, newState: { uid: 101 } }],
  }
  Editors.set(editor.uid, editor as any, replacement as any)

  await jest.advanceTimersByTimeAsync(500)

  expect(Editors.get(editor.uid).newState.widgets[0].newState.uid).toBe(101)
})
