import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-tab-modified-status-on-type'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  const modifiedTabs = Locator('.MainTabModified')

  // assert
  await expect(modifiedTabs).toHaveCount(0)

  // act
  await Editor.setCursor(0, 3)
  await Editor.type('d')

  // assert
  await expect(modifiedTabs).toHaveCount(1)
}
