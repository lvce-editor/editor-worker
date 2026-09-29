import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-line-height-live-cursor'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const saveLineHeight = async (lineHeight: number) => {
    await FileSystem.writeFile('app:///settings.json', JSON.stringify({ 'editor.fontSize': 18, 'editor.lineHeight': lineHeight }))
  }
  await Settings.update({ 'editor.fontSize': 18, 'editor.lineHeight': 200 })
  await saveLineHeight(200)
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/line-height-live-cursor.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setUri(tmpDir)
  await Main.openUri(filePath)

  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('height', '200px')
  await Editor.cursorDown()
  await expect(cursor).toHaveCSS('translate', '0px 200px')

  await saveLineHeight(20)
  await expect(cursor).toHaveCSS('height', '20px')
  await expect(cursor).toHaveCSS('translate', '0px 20px')

  await saveLineHeight(200)
  await expect(cursor).toHaveCSS('height', '200px')
  await expect(cursor).toHaveCSS('translate', '0px 200px')

  await saveLineHeight(20)
  await expect(cursor).toHaveCSS('height', '20px')
  await expect(cursor).toHaveCSS('translate', '0px 20px')
}
