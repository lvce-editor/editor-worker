import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.settings-select-item'

export const test: Test = async ({ Command, expect, Locator, Main, SettingsView }) => {
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await SettingsView.handleInput('word wrap')

  const wordWrap = Locator('select[name="editor.wordWrap"]')
  await expect(wordWrap).toBeVisible()
  await expect(wordWrap).toHaveValue('off')
  await Command.execute('Settings.handleSettingSelect', 'editor.wordWrap', 'on')
  await expect(wordWrap).toHaveValue('on')

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await SettingsView.handleInput('word wrap')
  await expect(wordWrap).toHaveValue('on')

  await SettingsView.handleInput('line numbers')
  const lineNumbers = Locator('select[name="editor.lineNumbers"]')
  await expect(lineNumbers).toBeVisible()
  await expect(lineNumbers).toHaveValue('on')
  await Command.execute('Settings.handleSettingSelect', 'editor.lineNumbers', 'off')
  await expect(lineNumbers).toHaveValue('off')

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await SettingsView.handleInput('line numbers')
  await expect(lineNumbers).toHaveValue('off')

  await SettingsView.handleInput('multi cursor modifier')

  const multiCursorModifier = Locator('select[name="editor.multiCursorModifier"]')
  await expect(multiCursorModifier).toBeVisible()
  await expect(multiCursorModifier.locator('option')).toHaveCount(2)
  await expect(multiCursorModifier.locator('option').nth(0)).toHaveText('Alt')
  await expect(multiCursorModifier.locator('option').nth(1)).toHaveText('Ctrl/Cmd')
  await expect(multiCursorModifier).toHaveValue('alt')
  await multiCursorModifier.focus()
  await multiCursorModifier.press('ArrowDown')
  await expect(multiCursorModifier).toHaveValue('ctrlCmd')

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await SettingsView.handleInput('multi cursor modifier')
  await expect(multiCursorModifier).toHaveValue('ctrlCmd')
}
