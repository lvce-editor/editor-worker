import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-tab-modified-status-on-save'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(filePath, `abc`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  const modifiedTabs = Locator('.MainTabModified')

  // assert
  await expect(modifiedTabs).toHaveCount(0)

  // act
  await Editor.setCursor(0, 3)
  await Editor.type('d')

  // assert
  await expect(modifiedTabs).toHaveCount(1)

  // act
  await Main.save()

  // assert
  await expect(modifiedTabs).toHaveCount(0)
}
