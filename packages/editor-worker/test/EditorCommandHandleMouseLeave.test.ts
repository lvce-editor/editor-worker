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

  EditorCommandHandleMouseLeave.handleMouseLeave(String(editor.uid))
  await jest.advanceTimersByTimeAsync(499)
  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(1)

  await jest.advanceTimersByTimeAsync(1)
  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(0)
})

test('handleMouseLeave - an editor re-entry cancels the pending dismissal', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  EditorCommandHandleMouseLeave.handleMouseLeave(editor.uid)
  EditorCommandHandleMouseLeave.handleMouseEnter(editor.uid)

  await jest.advanceTimersByTimeAsync(500)

  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(1)
})

test('handleMouseLeave - a hover widget uses its editor uid from the event target', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  using _mockRpc = RendererWorker.registerMockRpc({ 'Editor.renderPending': jest.fn() })

  // Functional hover viewlets dispatch their own uid first, then the editor uid from data-uid.
  EditorCommandHandleMouseLeave.handleMouseLeave(100, String(editor.uid))
  await jest.advanceTimersByTimeAsync(500)

  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(0)
})

test('handleMouseLeave - mouse re-entry cancels the pending dismissal', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  EditorCommandHandleMouseLeave.handleMouseLeave(editor.uid)
  EditorCommandHandleMouseLeave.handleMouseEnter(editor.uid)

  await jest.advanceTimersByTimeAsync(500)

  expect(Editors.get(editor.uid).newState.widgets).toHaveLength(1)
})

test('handleMouseLeave - does not remove a replacement hover', async () => {
  jest.useFakeTimers()
  Editors.set(editor.uid, editor as any, editor as any)
  using _mockRpc = RendererWorker.registerMockRpc({ 'Editor.renderPending': jest.fn() })
  EditorCommandHandleMouseLeave.handleMouseLeave(editor.uid)
  const replacement = {
    ...editor,
    widgets: [{ id: WidgetId.Hover, newState: { uid: 101 } }],
  }
  Editors.set(editor.uid, editor as any, replacement as any)

  await jest.advanceTimersByTimeAsync(500)

  expect(Editors.get(editor.uid).newState.widgets[0].newState.uid).toBe(101)
})
