import { beforeEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

const dispose = jest.fn(async () => {})

jest.unstable_mockModule('../src/parts/RenameWorker/RenameWorker.ts', () => ({
  dispose,
}))

const DisposeRenameWorker = await import('../src/parts/DisposeRenameWorker/DisposeRenameWorker.ts')
const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')

beforeEach(() => {
  dispose.mockReset()
  EditorStates.dispose(1)
  EditorStates.dispose(2)
})

test('disposes the worker when the rename widget is removed', async () => {
  const oldEditor = { widgets: [{ id: WidgetId.Rename }] }
  const newEditor = { widgets: [] }

  await DisposeRenameWorker.disposeRenameWorkerIfNeeded(oldEditor, newEditor)

  expect(dispose).toHaveBeenCalledTimes(1)
})

test('keeps the worker when the rename widget remains visible', async () => {
  const oldEditor = { widgets: [{ id: WidgetId.Rename }] }
  const newEditor = { widgets: [{ id: WidgetId.Rename }] }

  await DisposeRenameWorker.disposeRenameWorkerIfNeeded(oldEditor, newEditor)

  expect(dispose).not.toHaveBeenCalled()
})

test('does not launch or dispose a worker when no rename widget was open', async () => {
  await DisposeRenameWorker.disposeRenameWorkerIfNeeded({ widgets: [] }, { widgets: [] })

  expect(dispose).not.toHaveBeenCalled()
})

test('keeps the worker when another editor still has a rename widget', async () => {
  const oldEditor = { uid: 1, widgets: [{ id: WidgetId.Rename }] }
  const newEditor = { uid: 1, widgets: [] }
  const otherEditor = { uid: 2, widgets: [{ id: WidgetId.Rename }] }
  EditorStates.set(2, otherEditor as any, otherEditor as any)

  await DisposeRenameWorker.disposeRenameWorkerIfNeeded(oldEditor, newEditor)

  expect(dispose).not.toHaveBeenCalled()
})
