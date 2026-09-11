import { expect, jest, test } from '@jest/globals'

const getPreference = jest.fn<(key: string) => Promise<any>>()
jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({ get: getPreference }))
const { getEditorPreferences } = await import('../src/parts/GetEditorPreferences/GetEditorPreferences.ts')

test('whitespace token combining is opt-in', async () => {
  getPreference.mockResolvedValue(undefined)
  expect((await getEditorPreferences()).combineWhitespaceTokens).toBe(false)
  getPreference.mockImplementation(async (key) => (key === 'editor.combineWhitespaceTokens' ? true : undefined))
  expect((await getEditorPreferences()).combineWhitespaceTokens).toBe(true)
  getPreference.mockResolvedValue(false)
  expect((await getEditorPreferences()).combineWhitespaceTokens).toBe(false)
})
