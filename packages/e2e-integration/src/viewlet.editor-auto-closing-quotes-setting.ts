import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-auto-closing-quotes-setting'

export const test: Test = async ({ Command, Editor, expect, FileSystem, KeyBoard, Locator, Main, Settings, SettingsView }) => {
  const waitForAutoClosingQuotesPreference = async (expected: boolean): Promise<void> => {
    for (let attempt = 0; attempt < 20; attempt++) {
      const actual = await Command.execute('Preferences.get', 'editor.autoClosingQuotes')
      if (actual === expected) {
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    const actual = await Command.execute('Preferences.get', 'editor.autoClosingQuotes')
    throw new Error(`Expected Auto Closing Quotes preference to be ${expected}, got ${String(actual)} (${typeof actual})`)
  }

  await Settings.update({
    'settings.useToggles': true,
  })
  await SettingsView.show()
  await SettingsView.handleInput('auto closing quotes')

  const setting = Locator('.SettingsItem:has(input[name="editor.autoClosingQuotes"])')
  const input = setting.locator('input[name="editor.autoClosingQuotes"]')
  const label = setting.locator('.Label')
  await expect(input).toBeVisible()
  await expect(input).toHaveAttribute('type', 'checkbox')
  await expect(input).toHaveClass('Toggle')
  await expect(input).toHaveJSProperty('checked', true)

  await label.click()
  await expect(input).toHaveJSProperty('checked', false)
  await waitForAutoClosingQuotesPreference(false)

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.handleInput('auto closing quotes')
  await expect(Locator('input[name="editor.autoClosingQuotes"]')).toHaveJSProperty('checked', false)

  const tmpDir = await FileSystem.getTmpDir()
  const disabledUri = `${tmpDir}/auto-closing-quotes-disabled.txt`
  await FileSystem.writeFile(disabledUri, '')
  await Main.closeActiveEditor()
  await Main.openUri(disabledUri)
  await Editor.setCursor(0, 0)
  await KeyBoard.press('"')
  await expect(Locator('.EditorRow')).toHaveText('"')

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.handleInput('auto closing quotes')
  await Locator('.SettingsItem:has(input[name="editor.autoClosingQuotes"]) .Label').click()
  await expect(Locator('input[name="editor.autoClosingQuotes"]')).toHaveJSProperty('checked', true)
  await waitForAutoClosingQuotesPreference(true)

  await Command.execute('Settings.handleSettingChecked', 'settings.useToggles', false)
  await expect(Locator('input[name="editor.autoClosingQuotes"]')).toHaveClass('CheckBox')

  await Main.closeActiveEditor()
  const enabledUri = `${tmpDir}/auto-closing-quotes-enabled.txt`
  await FileSystem.writeFile(enabledUri, '')
  await Main.openUri(enabledUri)
  await Editor.setCursor(0, 0)
  await KeyBoard.press('"')
  await expect(Locator('.EditorRow')).toHaveText('""')

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.handleInput('auto closing quotes')
  await expect(Locator('input[name="editor.autoClosingQuotes"]')).toHaveJSProperty('checked', true)
}
