import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.settings-live-line-height-cursor'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const setLineHeight = async (lineHeight: number) => {
    await Settings.update({ 'editor.fontSize': 18, 'editor.lineHeight': lineHeight })
    await FileSystem.writeFile('app:///settings.json', JSON.stringify({ 'editor.fontSize': 18, 'editor.lineHeight': lineHeight }))
    await Command.execute('Layout.handleSettingsChanged')
  }
  await setLineHeight(200)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/settings-live-line-height-cursor.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('height', '200px')
  await Editor.cursorDown()
  await expect(cursor).toHaveCSS('translate', '0px 200px')

  await setLineHeight(20)
  await expect(cursor).toHaveCSS('height', '20px')
  await expect(cursor).toHaveCSS('translate', '0px 20px')

  await setLineHeight(200)
  await expect(cursor).toHaveCSS('height', '200px')
  await expect(cursor).toHaveCSS('translate', '0px 200px')

  await setLineHeight(20)
  await expect(cursor).toHaveCSS('height', '20px')
  await expect(cursor).toHaveCSS('translate', '0px 20px')
}
