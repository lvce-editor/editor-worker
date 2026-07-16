import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.settings-live-line-numbers'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': false })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/settings-live-line-numbers.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

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
