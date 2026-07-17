import { beforeEach, expect, jest, test } from '@jest/globals'
import { WidgetId } from '@lvce-editor/constants'
import type { EditorState } from '../src/parts/State/State.ts'

const getPreferenceMock = jest.fn<(key: string) => Promise<string>>()
const saveMock = jest.fn<(editor: EditorState) => Promise<EditorState>>()

jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({
  get: getPreferenceMock,
}))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandSave.ts', () => ({
  save: saveMock,
}))

const EditorCommandBlur = await import('../src/parts/EditorCommand/EditorCommandBlur.ts')

beforeEach(() => {
  getPreferenceMock.mockReset()
  saveMock.mockReset()
})

const createEditor = (overrides: Partial<EditorState> = {}): EditorState => {
  return {
    additionalFocus: 0,
    focused: true,
    modified: true,
    widgets: [],
    ...overrides,
  } as EditorState
}

test('handleBlur returns the editor unchanged when it is not focused', async () => {
  const editor = createEditor({ focused: false })

  const result = await EditorCommandBlur.handleBlur(editor)

  expect(result).toBe(editor)
  expect(getPreferenceMock).not.toHaveBeenCalled()
  expect(saveMock).not.toHaveBeenCalled()
})

test('handleBlur clears focus without saving an unmodified editor', async () => {
  const editor = createEditor({ modified: false })

  const result = await EditorCommandBlur.handleBlur(editor)

  expect(result).toEqual({
    ...editor,
    focused: false,
  })
  expect(getPreferenceMock).not.toHaveBeenCalled()
  expect(saveMock).not.toHaveBeenCalled()
})

test('handleBlur closes transient widgets and clears additional focus', async () => {
  const completionWidget = { id: WidgetId.Completion }
  const findWidget = { id: WidgetId.Find }
  const editor = createEditor({
    additionalFocus: 9,
    modified: false,
    widgets: [completionWidget, findWidget],
  })

  const result = await EditorCommandBlur.handleBlur(editor)

  expect(result).toEqual({
    ...editor,
    additionalFocus: 0,
    focused: false,
    widgets: [findWidget],
  })
})

test('handleBlur does not save when auto save is off', async () => {
  getPreferenceMock.mockResolvedValue('off')
  const editor = createEditor()

  const result = await EditorCommandBlur.handleBlur(editor)

  expect(result).toEqual({
    ...editor,
    focused: false,
  })
  expect(getPreferenceMock).toHaveBeenCalledWith('files.autoSave')
  expect(saveMock).not.toHaveBeenCalled()
})

test('handleBlur saves when auto save is enabled', async () => {
  getPreferenceMock.mockResolvedValue('afterDelay')
  const editor = createEditor()
  const savedEditor = createEditor({
    focused: false,
    modified: false,
  })
  saveMock.mockResolvedValue(savedEditor)

  const result = await EditorCommandBlur.handleBlur(editor)

  expect(result).toBe(savedEditor)
  expect(getPreferenceMock).toHaveBeenCalledWith('files.autoSave')
  expect(saveMock).toHaveBeenCalledWith({
    ...editor,
    focused: false,
  })
})
