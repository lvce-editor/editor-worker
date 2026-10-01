import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.settings-tab-completion-select'

export const test: Test = async ({ Command, expect, Locator, Main, SettingsView }) => {
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await SettingsView.handleInput('tab completion')

  const setting = Locator('.SettingsItem').filter({ hasText: 'Tab Completion' })
  const tabCompletion = setting.locator('select[name="editor.tabCompletion"]')

  await expect(setting).toBeVisible()
  await expect(setting).toContainText('Enables tab completions')
  await expect(tabCompletion).toBeVisible()
  await expect(tabCompletion).toHaveValue('on')
  await expect(tabCompletion.locator('option')).toHaveText(['On', 'off'])

  await Command.execute('Settings.handleSettingSelect', 'editor.tabCompletion', 'off')
  await expect(tabCompletion).toHaveValue('off')

  await Main.closeActiveEditor()
  await SettingsView.show()
  await SettingsView.selectTab('text-editor')
  await SettingsView.handleInput('tab completion')
  await expect(Locator('.SettingsItem').filter({ hasText: 'Tab Completion' }).locator('select[name="editor.tabCompletion"]')).toHaveValue('off')
}
