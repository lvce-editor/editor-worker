import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.active-line-number'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': true })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/active-line-number.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const activeLineNumber = Locator('.LineNumberActive')
  await expect(activeLineNumber).toHaveText('1')

  await Editor.cursorDown()
  await expect(activeLineNumber).toHaveText('2')

  await Command.execute('Editor.handleBlur')
  await expect(activeLineNumber).toHaveText('2')
}
