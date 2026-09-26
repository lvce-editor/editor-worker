import { beforeEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'

type TestEditor = { widgets: { id?: number }[] }

const closeCompletion = jest.fn((editor: TestEditor) => ({ ...editor, widgets: [] }))
const openCompletion = jest.fn((editor: TestEditor) => ({ ...editor, widgets: [{ id: WidgetId.Completion }] }))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandCloseCompletion.ts', () => ({ closeCompletion }))
jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandOpenCompletion.ts', () => ({ openCompletion }))

const { toggleCompletion } = await import('../src/parts/EditorCommand/EditorCommandToggleCompletion.ts')

beforeEach(() => {
  closeCompletion.mockClear()
  openCompletion.mockClear()
})

test('opens the suggest widget when it is closed', async () => {
  const editor = { widgets: [] }

  expect(await toggleCompletion(editor)).toEqual({ widgets: [{ id: WidgetId.Completion }] })
  expect(openCompletion).toHaveBeenCalledWith(editor)
  expect(closeCompletion).not.toHaveBeenCalled()
})

test('closes the suggest widget when it is open', async () => {
  const editor = { widgets: [{ id: WidgetId.Completion }] }

  expect(await toggleCompletion(editor)).toEqual({ widgets: [] })
  expect(closeCompletion).toHaveBeenCalledWith(editor)
})

test('does nothing without an active editor', async () => {
  expect(await toggleCompletion(undefined)).toBeUndefined()
  expect(openCompletion).not.toHaveBeenCalled()
  expect(closeCompletion).not.toHaveBeenCalled()
})
