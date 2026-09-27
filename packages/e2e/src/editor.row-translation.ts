import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.row-translation'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/row-translation.txt`
  const content = 'x'.repeat(500)
  await FileSystem.writeFile(filePath, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const row = Locator('.EditorRow').first()
  await expect(row).toHaveCSS('translate', 'none')

  await Editor.cursorEnd()
  await expect(row).not.toHaveCSS('translate', 'none')

  await Editor.cursorHome()
  await expect(row).toHaveCSS('translate', 'none')
}
