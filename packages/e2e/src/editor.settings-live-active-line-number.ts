import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.settings-live-active-line-number'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.highlightActiveLineNumber': true, 'editor.lineNumbers': true })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/settings-live-active-line-number.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const activeLineNumber = Locator('.LineNumberActive')
  await expect(activeLineNumber).toHaveText('1')

  await Settings.update({ 'editor.highlightActiveLineNumber': false })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(activeLineNumber).toHaveCount(0)

  await Editor.cursorDown()
  await expect(activeLineNumber).toHaveCount(0)

  await Settings.update({ 'editor.highlightActiveLineNumber': true })
  await Command.execute('Editor.handleSettingsChanged')
  await expect(activeLineNumber).toHaveText('2')
}
