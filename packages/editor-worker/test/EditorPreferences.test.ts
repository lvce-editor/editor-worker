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

test('line height is at least the font size', async () => {
  getPreference.mockImplementation(async (key: string) => {
    if (key === 'editor.fontSize') {
      return 18
    }
    if (key === 'editor.lineHeight') {
      return 10
    }
    return undefined
  })

  await expect(EditorPreferences.getRowHeight()).resolves.toBe(18)
})

test('line height retains valid values at or above the font size', async () => {
  getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? 18 : 24))
  await expect(EditorPreferences.getRowHeight()).resolves.toBe(24)

  getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? 18 : 18))
  await expect(EditorPreferences.getRowHeight()).resolves.toBe(18)
})

test.each([0, -1, '10', 'invalid', null, NaN, Infinity])('invalid line height %s falls back to the font size', async (lineHeight) => {
  getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? 18 : lineHeight))
  await expect(EditorPreferences.getRowHeight()).resolves.toBe(18)
})
