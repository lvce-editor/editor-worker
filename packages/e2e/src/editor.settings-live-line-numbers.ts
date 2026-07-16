import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.settings-live-line-numbers'

export const test: Test = async ({ Command, expect, Locator, Main, Settings }) => {
  await Settings.update({ 'editor.lineNumbers': false })
  await Main.openUri('app://settings.json')

  const editorContent = Locator('.EditorContent')
  const gutter = Locator('.Gutter')
  await expect(editorContent).toBeVisible()
  await expect(gutter).toHaveCount(0)

  await Settings.update({ 'editor.lineNumbers': true })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(gutter).toBeVisible()

  await Settings.update({ 'editor.lineNumbers': false })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(gutter).toHaveCount(0)
}
