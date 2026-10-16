import { beforeEach, expect, jest, test } from '@jest/globals'

const getPreference = jest.fn<(key: string) => Promise<any>>()
const warn = jest.fn()

jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({
  get: getPreference,
}))
jest.unstable_mockModule('../src/parts/Logger/Logger.ts', () => ({ warn }))

const EditorPreferences = await import('../src/parts/EditorPreferences/EditorPreferences.ts')

beforeEach(() => {
  getPreference.mockReset()
  warn.mockReset()
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

test.each([0, '0', -1, '10', 'invalid', null, NaN, Infinity])(
  'invalid or automatic line height %s falls back to the font size',
  async (lineHeight) => {
    getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? 18 : lineHeight))
    await expect(EditorPreferences.getRowHeight()).resolves.toBe(18)
  },
)

test('line height is capped at 100 and warns once for repeated reads', async () => {
  getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? 18 : 200))

  await expect(EditorPreferences.getRowHeight()).resolves.toBe(100)
  await expect(EditorPreferences.getRowHeight()).resolves.toBe(100)
  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn).toHaveBeenCalledWith('[editor-worker] editor.lineHeight value 200 is too large; using 100')
})

test('an explicit line height below font size is raised and warns', async () => {
  getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? 18 : 12))

  await expect(EditorPreferences.getRowHeight()).resolves.toBe(18)
  expect(warn).toHaveBeenCalledWith('[editor-worker] editor.lineHeight value 12 is too small; using 18')
})

test.each([
  [9, 10],
  [10, 10],
  [18, 18],
  [100, 100],
  [101, 100],
])('normalizes font size %s to %s', async (fontSize, expected) => {
  getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? fontSize : undefined))

  await expect(EditorPreferences.getFontSize()).resolves.toBe(expected)
})

test('non-numeric and non-finite font sizes use the default', async () => {
  for (const fontSize of ['12', 'invalid', null, NaN, Infinity]) {
    getPreference.mockImplementation(async (key: string) => (key === 'editor.fontSize' ? fontSize : undefined))
    await expect(EditorPreferences.getFontSize()).resolves.toBe(15)
  }
})

test('font size warnings identify the supplied value and applied bound', async () => {
  getPreference.mockResolvedValue(120)

  await expect(EditorPreferences.getFontSize()).resolves.toBe(100)
  expect(warn).toHaveBeenCalledWith('[editor-worker] editor.fontSize value 120 is too large; using 100')
})

test('font size warnings cover small values and settings updates', async () => {
  getPreference.mockResolvedValue(5)
  await expect(EditorPreferences.getFontSize()).resolves.toBe(10)
  getPreference.mockResolvedValue(6)
  await expect(EditorPreferences.getFontSize()).resolves.toBe(10)

  expect(warn).toHaveBeenCalledTimes(2)
  expect(warn).toHaveBeenNthCalledWith(1, '[editor-worker] editor.fontSize value 5 is too small; using 10')
  expect(warn).toHaveBeenNthCalledWith(2, '[editor-worker] editor.fontSize value 6 is too small; using 10')
})
