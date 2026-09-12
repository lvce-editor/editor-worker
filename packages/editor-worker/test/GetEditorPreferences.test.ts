import { expect, jest, test } from '@jest/globals'

const getPreference = jest.fn<(key: string) => Promise<any>>()
jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({ get: getPreference }))
const { getEditorPreferences } = await import('../src/parts/GetEditorPreferences/GetEditorPreferences.ts')

test('whitespace token combining defaults to enabled and respects explicit preferences', async () => {
  getPreference.mockResolvedValue(undefined)
  expect((await getEditorPreferences()).combineWhitespaceTokens).toBe(true)
  getPreference.mockImplementation(async (key) => (key === 'editor.combineWhitespaceTokens' ? true : undefined))
  expect((await getEditorPreferences()).combineWhitespaceTokens).toBe(true)
  getPreference.mockResolvedValue(false)
  expect((await getEditorPreferences()).combineWhitespaceTokens).toBe(false)
})

test('boolean preferences retain their defaults and explicit values', async () => {
  getPreference.mockResolvedValue(undefined)
  expect(await getEditorPreferences()).toMatchObject({
    breadcrumbsEnabled: false,
    diagnosticsEnabled: false,
    dragAndDropEnabled: true,
    formatOnSave: false,
    hoverEnabled: true,
    insertSpaces: true,
    roundedSelection: false,
  })
  for (const value of [false, true]) {
    getPreference.mockResolvedValue(value)
    expect(await getEditorPreferences()).toMatchObject({
      breadcrumbsEnabled: value,
      diagnosticsEnabled: value,
      dragAndDropEnabled: value,
      formatOnSave: value,
      hoverEnabled: value,
      insertSpaces: value,
      roundedSelection: value,
    })
  }
})
