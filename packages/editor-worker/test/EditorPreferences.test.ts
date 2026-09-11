import { beforeEach, expect, jest, test } from '@jest/globals'

const getPreference = jest.fn<(key: string) => Promise<any>>()

jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({
  get: getPreference,
}))

const EditorPreferences = await import('../src/parts/EditorPreferences/EditorPreferences.ts')

beforeEach(() => {
  getPreference.mockReset()
})

test('active line number highlighting is enabled by default', async () => {
  getPreference.mockResolvedValue(undefined)

  await expect(EditorPreferences.getHighlightActiveLineNumber()).resolves.toBe(true)
  expect(getPreference).toHaveBeenCalledWith('editor.highlightActiveLineNumber')
})

test('active line number highlighting can be disabled', async () => {
  getPreference.mockResolvedValue(false)

  await expect(EditorPreferences.getHighlightActiveLineNumber()).resolves.toBe(false)
})

test('merge conflict actions are disabled by default', async () => {
  getPreference.mockResolvedValue(undefined)

  await expect(EditorPreferences.getMergeConflictActionsEnabled()).resolves.toBe(false)
  expect(getPreference).toHaveBeenCalledWith('editor.mergeConflictActions')
})

test('merge conflict actions can be enabled', async () => {
  getPreference.mockResolvedValue(true)

  await expect(EditorPreferences.getMergeConflictActionsEnabled()).resolves.toBe(true)
})

test('reads the documented auto-closing brackets setting', async () => {
  getPreference.mockResolvedValue(true)

  await expect(EditorPreferences.isAutoClosingBracketsEnabled()).resolves.toBe(true)
  expect(getPreference).toHaveBeenCalledWith('editor.autoClosingBrackets')
})
