import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.scrollbar-switch-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const shortFilePath = `${tmpDir}/short.txt`
  const longFilePath = `${tmpDir}/long.txt`
  const longContent = Array.from({ length: 200 }, (_, index) => `line ${index}`).join('\n')

  await FileSystem.writeFile(shortFilePath, 'short')
  await FileSystem.writeFile(longFilePath, longContent)
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()

  await Main.openUri(shortFilePath)

  const editorRows = Locator('.EditorRows')
  const verticalThumb = Locator('.ScrollBarThumbVertical')
  await expect(verticalThumb).toHaveCSS('height', '0px')

  await Main.openUri(longFilePath)
  await expect(verticalThumb).toBeVisible()

  await Main.selectTab(0, 0)
  await expect(editorRows).toHaveText('short')
  await expect(verticalThumb).toHaveCSS('height', '0px')
}
