import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.settings-tab-completion-select'

export const test: Test = async ({ Command, expect, Locator, Main, SettingsView }) => {
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await expect(Locator('.SettingsContentHeading')).toHaveText('Text Editor')
  await SettingsView.handleInput('tab completion')

  const setting = Locator('.SettingsItem:has(select[name="editor.tabCompletion"])')
  const tabCompletion = Locator('select[name="editor.tabCompletion"]')

  await expect(setting).toBeVisible()
  await expect(setting).toContainText('Enables tab completions')
  await expect(tabCompletion).toBeVisible()
  await expect(tabCompletion).toHaveValue('on')
  await expect(tabCompletion.locator('option')).toHaveCount(2)
  await expect(tabCompletion.locator('option').nth(0)).toHaveText('On')
  await expect(tabCompletion.locator('option').nth(1)).toHaveText('off')

  await Command.execute('Settings.handleSettingSelect', 'editor.tabCompletion', 'off')
  await expect(tabCompletion).toHaveValue('off')

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await SettingsView.handleInput('tab completion')
  await expect(Locator('select[name="editor.tabCompletion"]')).toHaveValue('off')
}
