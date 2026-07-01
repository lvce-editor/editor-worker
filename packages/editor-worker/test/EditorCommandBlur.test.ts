import { beforeEach, expect, jest, test } from '@jest/globals'

const saveMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandSave.ts', () => ({
  save: saveMock,
}))

const EditorCommandBlur = await import('../src/parts/EditorCommand/EditorCommandBlur.ts')

beforeEach(() => {
  saveMock.mockReset()
  saveMock.mockImplementation(async (editor: any) => ({
    ...editor,
    modified: false,
  }))
})

test('handleBlur - returns same editor when already unfocused', async () => {
  const editor: any = {
    focused: false,
    modified: true,
    saveOnBlur: true,
  }

  await expect(EditorCommandBlur.handleBlur(editor)).resolves.toBe(editor)
  expect(saveMock).not.toHaveBeenCalled()
})

test('handleBlur - saves modified editor when save on blur is enabled', async () => {
  const editor: any = {
    focused: true,
    modified: true,
    saveOnBlur: true,
  }

  await expect(EditorCommandBlur.handleBlur(editor)).resolves.toEqual({
    focused: false,
    modified: false,
    saveOnBlur: true,
  })
  expect(saveMock).toHaveBeenCalledWith({
    focused: false,
    modified: true,
    saveOnBlur: true,
  })
})

test('handleBlur - skips save when save on blur is disabled', async () => {
  const editor: any = {
    focused: true,
    modified: true,
    saveOnBlur: false,
  }

  await expect(EditorCommandBlur.handleBlur(editor)).resolves.toEqual({
    focused: false,
    modified: true,
    saveOnBlur: false,
  })
  expect(saveMock).not.toHaveBeenCalled()
})
