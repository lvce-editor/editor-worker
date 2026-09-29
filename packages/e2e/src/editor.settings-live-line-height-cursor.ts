import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.settings-live-line-height-cursor'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.fontSize': 18, 'editor.lineHeight': 200 })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/settings-live-line-height-cursor.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('height', '200px')
  await Editor.cursorDown()
  await expect(cursor).toHaveCSS('translate', '0px 200px')

  await Settings.update({ 'editor.lineHeight': 20 })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(cursor).toHaveCSS('height', '20px')
  await expect(cursor).toHaveCSS('translate', '0px 20px')

  await Settings.update({ 'editor.lineHeight': 200 })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(cursor).toHaveCSS('height', '200px')
  await expect(cursor).toHaveCSS('translate', '0px 200px')

  await Settings.update({ 'editor.lineHeight': 20 })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(cursor).toHaveCSS('height', '20px')
  await expect(cursor).toHaveCSS('translate', '0px 20px')
}
