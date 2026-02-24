import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-find-all-references'

export const test: Test = async ({ ContextMenu, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Find All References')

  // assert
  const sideBar = Locator('#SideBar')
  await expect(sideBar).toBeVisible()
}
