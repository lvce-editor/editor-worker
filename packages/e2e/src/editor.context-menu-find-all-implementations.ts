import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.context-menu-find-all-implementations'

export const test: Test = async ({ ContextMenu, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.css`, ':root { --color: red; }\nh1 { color: var(--color); }')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.css`)

  // act
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Find All Implementations')

  // assert
  const sidebar = Locator('#SideBar')
  await expect(sidebar).toBeVisible()
  await expect(sidebar).toContainText('No implementations found')

  // act again
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Find All Implementations')

  // assert again
  await expect(sidebar).toContainText('No implementations found')
}
