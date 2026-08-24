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
