import { expect, jest, test } from '@jest/globals'
import type { EditorState } from '../src/parts/State/State.ts'

const getEditorPreferences = jest.fn<() => Promise<any>>()
const measureCharacterWidth = jest.fn<(fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: number) => Promise<number>>()
const getPreference = jest.fn<(key: string) => Promise<any>>()

jest.unstable_mockModule('../src/parts/GetEditorPreferences/GetEditorPreferences.ts', () => ({
  getEditorPreferences,
}))

jest.unstable_mockModule('../src/parts/MeasureCharacterWidth/MeasureCharacterWidth.ts', () => ({
  measureCharacterWidth,
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.ts', () => ({
  get: getPreference,
}))

const { handleSettingsChanged } = await import('../src/parts/HandleSettingsChanged/HandleSettingsChanged.ts')

test('handleSettingsChanged reloads editor preferences and geometry', async () => {
  getEditorPreferences.mockResolvedValue({
    completionTriggerCharacters: ['.'],
    diagnosticsEnabled: false,
    fontFamily: 'Fira Code',
    fontSize: 16,
    fontWeight: 500,
    isAutoClosingBracketsEnabled: true,
    isAutoClosingQuotesEnabled: true,
    isAutoClosingTagsEnabled: true,
    isQuickSuggestionsEnabled: true,
    letterSpacing: 1,
    lineNumbers: false,
    rowHeight: 24,
    tabSize: 4,
  })
  measureCharacterWidth.mockResolvedValue(10)
  getPreference.mockResolvedValue(true)
  const state = {
    columnWidth: 9,
    deltaY: 40,
    diagnostics: [{ message: 'problem' }],
    height: 48,
    itemHeight: 20,
    lines: ['one', 'two', 'three', 'four'],
    minimumSliderSize: 20,
    rowHeight: 20,
    visualDecorations: [{ className: 'DiagnosticError' }],
    width: 800,
    x: 0,
    y: 0,
  } as unknown as EditorState

  const result = await handleSettingsChanged(state)

  expect(measureCharacterWidth).toHaveBeenCalledWith(500, 16, 'Fira Code', 1)
  expect(getPreference).toHaveBeenCalledWith('editor.completionsOnType')
  expect(result).toEqual(
    expect.objectContaining({
      charWidth: 10,
      columnWidth: 10,
      completionsOnType: true,
      diagnostics: [],
      fontFamily: 'Fira Code',
      fontSize: 16,
      fontWeight: 500,
      isMonospaceFont: true,
      itemHeight: 24,
      letterSpacing: 1,
      lineNumbers: false,
      maxLineY: 3,
      minLineY: 1,
      rowHeight: 24,
      tabSize: 4,
      visualDecorations: [],
    }),
  )
})
